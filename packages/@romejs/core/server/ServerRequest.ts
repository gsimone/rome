/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
	DEFAULT_CLIENT_FLAGS,
	DEFAULT_CLIENT_REQUEST_FLAGS,
} from "../common/types/client";
import {JSONFileReference} from "../common/types/files";
import {
	Diagnostic,
	DiagnosticAdvice,
	DiagnosticCategory,
	DiagnosticDescription,
	DiagnosticLocation,
	Diagnostics,
	DiagnosticsError,
	DiagnosticsProcessor,
	createSingleDiagnosticError,
	deriveDiagnosticFromError,
	descriptions,
	getDiagnosticsFromError,
} from "@romejs/diagnostics";
import {
	DiagnosticsPrinter,
	DiagnosticsPrinterFlags,
} from "@romejs/cli-diagnostics";
import {
	ProjectConfigCategoriesWithIgnore,
	ProjectDefinition,
} from "@romejs/project";
import {ResolverOptions, ResolverQueryResponseFound} from "./fs/Resolver";
import {BundlerConfig} from "../common/types/bundler";
import ServerBridge, {
	ServerQueryRequest,
	ServerQueryResponse,
	ServerQueryResponseSuccess,
} from "../common/bridges/ServerBridge";
import Server, {
	ServerClient,
	ServerMarker,
	ServerUnfinishedMarker,
} from "./Server";
import {Reporter} from "@romejs/cli-reporter";
import {
	Event,
	EventSubscription,
	mergeEventSubscriptions,
} from "@romejs/events";
import {
	FlagValue,
	SerializeCLITarget,
	serializeCLIFlags,
} from "@romejs/cli-flags";
import {JSRoot} from "@romejs/ast";
import {TransformStageName} from "@romejs/compiler";
import WorkerBridge, {
	PrefetchedModuleSignatures,
	WorkerAnalyzeDependencyResult,
	WorkerCompileResult,
	WorkerCompilerOptions,
	WorkerFormatResult,
	WorkerLintOptions,
	WorkerLintResult,
	WorkerParseOptions,
} from "../common/bridges/WorkerBridge";
import {ModuleSignature} from "@romejs/js-analysis";
import {
	AbsoluteFilePath,
	AbsoluteFilePathSet,
	UnknownFilePath,
	createAbsoluteFilePath,
	createUnknownFilePath,
} from "@romejs/path";
import crypto = require("crypto");
import {Dict, RequiredProps} from "@romejs/typescript-helpers";
import {ob1Coerce0, ob1Number0, ob1Number1} from "@romejs/ob1";
import {MemoryFSGlobOptions} from "./fs/MemoryFileSystem";
import {markup} from "@romejs/string-markup";
import {DiagnosticsProcessorOptions} from "@romejs/diagnostics/DiagnosticsProcessor";
import {JSONObject} from "@romejs/codec-json";
import {VCSClient} from "@romejs/vcs";
import {InlineSnapshotUpdates} from "../test-worker/SnapshotManager";

type ServerRequestOptions = {
	server: Server;
	client: ServerClient;
	query: ServerQueryRequest;
};

let requestIdCounter = 0;

type NormalizedCommandFlags = {
	flags: undefined | Dict<unknown>;
	defaultFlags: Dict<unknown>;
};

type ResolvedArg = {
	path: AbsoluteFilePath;
	location: DiagnosticLocation;
	project: ProjectDefinition;
};

type ResolvedArgs = Array<ResolvedArg>;

export const EMPTY_SUCCESS_RESPONSE: ServerQueryResponseSuccess = {
	type: "SUCCESS",
	hasData: false,
	data: undefined,
	markers: [],
};

type GetFilesTryAlternateArg = (
	path: UnknownFilePath,
) => undefined | UnknownFilePath;

export type ServerRequestGetFilesOptions = Omit<
	MemoryFSGlobOptions,
	"getProjectIgnore"
> & {
	tryAlternateArg?: GetFilesTryAlternateArg;
	ignoreArgumentMisses?: boolean;
	ignoreProjectIgnore?: boolean;
	disabledDiagnosticCategory?: DiagnosticCategory;
	advice?: DiagnosticAdvice;
	configCategory?: ProjectConfigCategoriesWithIgnore;
	verb?: string;
	noun?: string;
	args?: Array<string>;
};

export type ServerRequestGetFilesResult = {
	projects: Set<ProjectDefinition>;
	paths: AbsoluteFilePathSet;
};

export class ServerRequestInvalid extends DiagnosticsError {
	constructor(message: string, diagnostics: Diagnostics, showHelp: boolean) {
		super(message, diagnostics);
		this.showHelp = showHelp;
	}

	showHelp: boolean;
}

function hash(val: JSONObject): string {
	return val === undefined || Object.keys(val).length === 0
		? "none"
		: crypto.createHash("sha256").update(JSON.stringify(val)).digest("hex");
}

export class ServerRequestCancelled extends Error {
	constructor() {
		super(
			"ServerRequest has been cancelled. This error is meant to be seen by Server",
		);
	}
}

export default class ServerRequest {
	constructor(opts: ServerRequestOptions) {
		this.query = opts.query;
		this.server = opts.server;
		this.bridge = opts.client.bridge;
		this.reporter = opts.client.reporter;
		this.cancelled = false;
		this.toredown = false;
		this.markerEvent = new Event({
			name: "ServerRequest.marker",
			onError: this.server.onFatalErrorBound,
		});
		this.endEvent = new Event({
			name: "ServerRequest.teardown",
			onError: this.server.onFatalErrorBound,
			serial: true,
		});
		this.client = opts.client;
		this.id = requestIdCounter++;
		this.markers = [];
		this.start = Date.now();
		this.normalizedCommandFlags = {
			flags: {},
			defaultFlags: {},
		};
		this.client.requestsInFlight.add(this);
	}

	start: number;
	client: ServerClient;
	query: ServerQueryRequest;
	server: Server;
	bridge: ServerBridge;
	reporter: Reporter;
	id: number;
	markerEvent: Event<ServerMarker, void>;
	endEvent: Event<undefined | ServerQueryResponse, void>;
	normalizedCommandFlags: NormalizedCommandFlags;
	markers: Array<ServerMarker>;
	cancelled: boolean;
	toredown: boolean;

	async init() {
		if (this.query.requestFlags.collectMarkers) {
			this.markerEvent.subscribe((marker) => {
				this.markers.push(marker);
			});
		}

		await this.server.handleRequestStart(this);
	}

	checkCancelled() {
		if (this.cancelled) {
			throw new ServerRequestCancelled();
		}
	}

	cancel() {
		this.cancelled = true;
		this.teardown({
			type: "CANCELLED",
		});
	}

	teardown(
		res: undefined | ServerQueryResponse,
	): undefined | ServerQueryResponse {
		if (this.toredown) {
			return;
		}

		this.toredown = true;
		this.client.requestsInFlight.delete(this);

		// Output timing information
		if (this.query.requestFlags.timing) {
			const end = Date.now();
			this.reporter.info(
				`Request took <duration emphasis>${String(end - this.start)}</duration>`,
			);
		}

		if (res !== undefined) {
			// If the query asked for no data then strip all diagnostics and data values
			if (this.query.noData) {
				if (res.type === "SUCCESS") {
					res = {
						...EMPTY_SUCCESS_RESPONSE,
						hasData: res.data !== undefined,
					};
				} else if (res.type === "DIAGNOSTICS") {
					res = {
						type: "DIAGNOSTICS",
						hasDiagnostics: res.hasDiagnostics,
						diagnostics: [],
					};
				} else if (res.type === "INVALID_REQUEST") {
					res = {
						type: "INVALID_REQUEST",
						diagnostics: [],
						showHelp: res.showHelp,
					};
				}
			}

			// Add on markers
			if (res.type === "SUCCESS") {
				res = {
					...res,
					markers: this.markers,
				};
			}
		}

		this.reporter.teardown();
		this.endEvent.send(res);
		this.server.handleRequestEnd(this);
		return res;
	}

	setNormalizedCommandFlags(normalized: NormalizedCommandFlags) {
		this.normalizedCommandFlags = normalized;
	}

	async resolveEntryAssertPathArg(index: number): Promise<AbsoluteFilePath> {
		this.expectArgumentLength(index + 1);
		const arg = this.query.args[index];

		return await this.server.resolver.resolveEntryAssertPath(
			{
				...this.getResolverOptionsFromFlags(),
				source: createUnknownFilePath(arg),
			},
			{location: this.getDiagnosticPointerFromFlags({type: "arg", key: index})},
		);
	}

	async assertClientCwdProject(): Promise<ProjectDefinition> {
		const location = this.getDiagnosticPointerForClientCwd();
		return this.server.projectManager.assertProject(
			this.client.flags.cwd,
			location,
		);
	}

	async getVCSClient(): Promise<VCSClient> {
		return this.server.projectManager.getVCSClient(
			await this.assertClientCwdProject(),
		);
	}

	async maybeGetVCSClient(): Promise<undefined | VCSClient> {
		return this.server.projectManager.maybeGetVCSClient(
			await this.assertClientCwdProject(),
		);
	}

	createDiagnosticsProcessor(
		opts: DiagnosticsProcessorOptions = {},
	): DiagnosticsProcessor {
		return new DiagnosticsProcessor({
			markupOptions: this.reporter.markupOptions,
			...opts,
		});
	}

	createDiagnosticsPrinter(
		processor: DiagnosticsProcessor = this.createDiagnosticsProcessor(),
	): DiagnosticsPrinter {
		processor.unshiftOrigin({
			category: "server",
			message: `${this.query.commandName} command was dispatched`,
		});

		return new DiagnosticsPrinter({
			processor,
			reporter: this.reporter,
			cwd: this.client.flags.cwd,
			flags: this.getDiagnosticsPrinterFlags(),
			readFile: this.server.readDiagnosticsPrinterFile.bind(this.server),
		});
	}

	getDiagnosticsPrinterFlags(): DiagnosticsPrinterFlags {
		const {requestFlags} = this.query;
		return {
			grep: requestFlags.grep,
			inverseGrep: requestFlags.inverseGrep,
			showAllDiagnostics: requestFlags.showAllDiagnostics,
			verboseDiagnostics: requestFlags.verboseDiagnostics,
			maxDiagnostics: requestFlags.maxDiagnostics,
			fieri: requestFlags.fieri,
		};
	}

	expectArgumentLength(min: number, max: number = min) {
		const {args} = this.query;
		let message;

		let excessive = false;

		if (min === max) {
			if (args.length !== min) {
				if (min === 0) {
					message = `Expected no arguments`;
				} else {
					message = `Expected exactly <number emphasis>${min}</number> arguments`;
				}
			}
		} else {
			if (args.length < min) {
				message = `Expected at least <number emphasis>${min}</number> arguments`;
			}

			if (args.length > max) {
				excessive = true;
				message = `Expected no more than <number emphasis>${min}</number> arguments`;
			}
		}

		if (message !== undefined) {
			this.throwDiagnosticFlagError({
				target: {
					type: "arg-range",
					from: min,
					to: max,
				},
				description: descriptions.FLAGS.INCORRECT_ARG_COUNT(excessive, message),
			});
		}
	}

	throwDiagnosticFlagError(
		{
			description,
			target = {type: "none"},
			showHelp = true,
		}: {
			description: RequiredProps<Partial<DiagnosticDescription>, "message">;
			target?: SerializeCLITarget;
			showHelp?: boolean;
		},
	) {
		const location = this.getDiagnosticPointerFromFlags(target);

		let {category} = description;
		if (category === undefined) {
			category =
				target.type === "arg" || target.type === "arg-range"
					? "args/invalid"
					: "flags/invalid";
		}

		const diag: Diagnostic = {
			description: {
				advice: [],
				...description,
				category,
			},
			location,
		};

		throw new ServerRequestInvalid(description.message.value, [diag], showHelp);
	}

	getDiagnosticPointerForClientCwd(): DiagnosticLocation {
		const cwd = this.client.flags.cwd.join();
		return {
			sourceText: cwd,
			start: {
				index: ob1Number0,
				line: ob1Number1,
				column: ob1Number0,
			},
			end: {
				index: ob1Coerce0(cwd.length),
				line: ob1Number1,
				column: ob1Coerce0(cwd.length),
			},
			filename: "cwd",
		};
	}

	getDiagnosticPointerFromFlags(target: SerializeCLITarget): DiagnosticLocation {
		const {query} = this;

		const rawFlags = {
			...this.client.flags,
			...this.query.requestFlags,
			...this.normalizedCommandFlags.flags,
		};
		const flags: Dict<FlagValue> = {
			...rawFlags,
			cwd: rawFlags.cwd.join(),
		};

		const rawDefaultFlags = {
			...DEFAULT_CLIENT_FLAGS,
			...DEFAULT_CLIENT_REQUEST_FLAGS,
			...this.normalizedCommandFlags.defaultFlags,
			clientName: this.client.flags.clientName,
		};
		const defaultFlags: Dict<FlagValue> = {
			...rawDefaultFlags,
			cwd: rawDefaultFlags.cwd.join(),
		};

		return serializeCLIFlags(
			{
				programName: "rome",
				commandName: query.commandName,
				flags,
				args: query.args,
				defaultFlags,
				incorrectCaseFlags: new Set(),
				shorthandFlags: new Set(),
			},
			target,
		);
	}

	getResolverOptionsFromFlags(): RequiredProps<ResolverOptions, "origin"> {
		const {requestFlags} = this.query;
		return {
			origin: this.client.flags.cwd,
			platform: requestFlags.resolverPlatform,
			scale: requestFlags.resolverScale,
			mocks: requestFlags.resolverMocks,
		};
	}

	getBundlerConfigFromFlags(
		resolverOpts?: Partial<ResolverOptions>,
	): BundlerConfig {
		return {
			inlineSourceMap: false,
			cwd: this.client.flags.cwd,
			resolver: {
				...this.getResolverOptionsFromFlags(),
				...resolverOpts,
			},
		};
	}

	async resolveFilesFromArgs(
		overrideArgs?: Array<string>,
		tryAlternateArg?: GetFilesTryAlternateArg,
	): Promise<{
		projects: Set<ProjectDefinition>;
		resolvedArgs: ResolvedArgs;
	}> {
		this.checkCancelled();

		const projects: Set<ProjectDefinition> = new Set();
		const rawArgs = overrideArgs === undefined ? this.query.args : overrideArgs;
		const resolvedArgs: ResolvedArgs = [];
		const {cwd} = this.client.flags;

		// If args was explicitly provided then don't assume empty args is the project root
		if (rawArgs.length === 0 && overrideArgs === undefined) {
			const location = this.getDiagnosticPointerForClientCwd();
			const project = await this.assertClientCwdProject();
			resolvedArgs.push({
				path: project.folder,
				location,
				project,
			});
			projects.add(project);
		} else {
			for (let i = 0; i < rawArgs.length; i++) {
				const arg = rawArgs[i];

				const location = this.getDiagnosticPointerFromFlags({
					type: "arg",
					key: i,
				});

				let source = createUnknownFilePath(arg);
				let resolved: undefined | ResolverQueryResponseFound;

				if (tryAlternateArg !== undefined) {
					const alternateSource = tryAlternateArg(source);
					if (alternateSource !== undefined) {
						const resolvedAlternate = await this.server.resolver.resolveEntry({
							origin: cwd,
							source: alternateSource,
							requestedType: "folder",
						});
						if (resolvedAlternate.type === "FOUND") {
							resolved = resolvedAlternate;
						}
					}
				}

				if (resolved === undefined) {
					resolved = await this.server.resolver.resolveEntryAssert(
						{
							origin: cwd,
							source,
							requestedType: "folder",
						},
						{
							location,
						},
					);
				}

				const project = this.server.projectManager.assertProjectExisting(
					resolved.path,
				);
				projects.add(project);

				resolvedArgs.push({
					project,
					path: resolved.path,
					location,
				});
			}
		}

		return {
			resolvedArgs,
			projects,
		};
	}

	async watchFilesFromArgs(
		opts: ServerRequestGetFilesOptions,
		callback: (
			result: ServerRequestGetFilesResult,
			initial: boolean,
		) => Promise<void>,
	): Promise<EventSubscription> {
		this.checkCancelled();

		// Everything needs to be relative to this
		const {resolvedArgs} = await this.resolveFilesFromArgs(
			opts.args,
			opts.tryAlternateArg,
		);

		let timeout: undefined | NodeJS.Timeout;
		let runningCallback = false;
		let unsubscribed = false;

		let pendingResult: ServerRequestGetFilesResult = {
			paths: new AbsoluteFilePathSet(),
			projects: new Set(),
		};

		async function flush(initial: boolean) {
			if (unsubscribed) {
				return;
			}

			if (!initial && pendingResult.paths.size === 0) {
				return;
			}

			timeout = undefined;

			const result = pendingResult;
			pendingResult = {
				paths: new AbsoluteFilePathSet(),
				projects: new Set(),
			};

			runningCallback = true;
			await callback(result, initial);
			runningCallback = false;

			if (pendingResult.paths.size > 0) {
				await flush(false);
			}
		}

		const onChange = (path: AbsoluteFilePath) => {
			let matches = false;
			for (const arg of resolvedArgs) {
				if (arg.path.equal(path) || path.isRelativeTo(arg.path)) {
					matches = true;
					break;
				}
			}
			if (!matches) {
				return;
			}

			const project = this.server.projectManager.findProjectExisting(path);
			if (project !== undefined) {
				pendingResult.projects.add(project);
			}

			pendingResult.paths.add(path);

			// Buffer up evicted paths
			if (!runningCallback && timeout === undefined) {
				timeout = setTimeout(() => flush(false), 100);
			}
		};

		const refreshFileEvent = this.server.refreshFileEvent.subscribe(onChange);

		const sub = mergeEventSubscriptions([
			refreshFileEvent,
			{
				unsubscribe() {
					unsubscribed = true;
					if (timeout !== undefined) {
						clearTimeout(timeout);
					}
				},
			},
		]);

		this.endEvent.subscribe(() => {
			sub.unsubscribe();
		});

		// Flush initial
		pendingResult = await this.getFilesFromArgs(opts);
		await flush(true);

		return sub;
	}

	async getFilesFromArgs(
		opts: ServerRequestGetFilesOptions = {},
	): Promise<ServerRequestGetFilesResult> {
		this.checkCancelled();

		const {server} = this;
		const {configCategory, ignoreProjectIgnore} = opts;
		const {projects, resolvedArgs} = await this.resolveFilesFromArgs(
			opts.args,
			opts.tryAlternateArg,
		);

		const extendedGlobOpts: MemoryFSGlobOptions = {...opts};

		if (configCategory !== undefined) {
			extendedGlobOpts.getProjectIgnore = (project) =>
				ignoreProjectIgnore ? [] : project.config[configCategory].ignore
			;
		}

		// Resolved arguments that resulted in no files
		const noArgMatches: Set<ResolvedArg> = new Set();

		// Match files
		const paths: AbsoluteFilePathSet = new AbsoluteFilePathSet();
		for (const arg of resolvedArgs) {
			const matches = server.memoryFs.glob(arg.path, extendedGlobOpts);

			if (matches.size === 0) {
				if (!opts.ignoreArgumentMisses) {
					noArgMatches.add(arg);
				}
			} else {
				for (const path of matches) {
					paths.add(path);
				}
			}
		}

		if (noArgMatches.size > 0) {
			const diagnostics: Diagnostics = [];

			for (const {path, project, location} of noArgMatches) {
				let category: DiagnosticCategory = "args/fileNotFound";

				let advice: DiagnosticAdvice = [...(opts.advice || [])];

				// Hint if all files were ignored
				if (configCategory !== undefined && !ignoreProjectIgnore) {
					const {paths: withoutIgnore} = await this.getFilesFromArgs({
						...opts,
						ignoreProjectIgnore: true,
					});

					// Remove paths that we already successfully found
					for (const path of paths) {
						withoutIgnore.delete(path);
					}

					if (withoutIgnore.size > 0) {
						advice.push({
							type: "log",
							category: "info",
							text: "The following files were ignored",
						});

						advice.push({
							type: "list",
							list: Array.from(withoutIgnore, (path) => path.toMarkup()),
							truncate: true,
						});

						const ignoreSource = server.projectManager.findProjectConfigConsumer(
							project,
							(consumer) =>
								consumer.has(configCategory) &&
								consumer.get(configCategory).get("ignore")
							,
						);

						if (ignoreSource.value !== undefined) {
							const ignorePointer = ignoreSource.value.getDiagnosticLocation(
								"value",
							);

							advice.push({
								type: "log",
								category: "info",
								text: "Ignore patterns were defined here",
							});

							advice.push({
								type: "frame",
								location: ignorePointer,
							});
						}
					}
				}

				diagnostics.push({
					location: {
						...location,
						marker: path.toMarkup(),
					},
					description: {
						...descriptions.FLAGS.NO_FILES_FOUND(opts.noun),
						category,
						advice,
					},
				});
			}

			throw new DiagnosticsError(
				"ServerRequest.getFilesFromArgs: Some arguments did not resolve to any files",
				diagnostics,
			);
		}

		return {paths, projects};
	}

	normalizeCompileResult(res: WorkerCompileResult): WorkerCompileResult {
		const {projectManager} = this.server;

		// Turn all the cacheDependencies entries from 'absolute paths to UIDs
		return {
			...res,
			cacheDependencies: res.cacheDependencies.map((filename) => {
				return projectManager.getFileReference(createAbsoluteFilePath(filename)).uid;
			}),
		};
	}

	startMarker(
		opts: Omit<ServerUnfinishedMarker, "start">,
	): ServerUnfinishedMarker {
		this.server.logger.info("[ServerRequest] Started marker", opts.label);
		return {
			...opts,
			start: Date.now(),
		};
	}

	endMarker(startMarker: ServerUnfinishedMarker): ServerMarker {
		const endMarker: ServerMarker = {
			...startMarker,
			end: Date.now(),
		};
		this.server.logger.info(
			"[ServerRequest] Finished marker",
			startMarker.label,
		);
		this.markerEvent.send(endMarker);
		return endMarker;
	}

	async wrapRequestDiagnostic<T>(
		method: string,
		path: AbsoluteFilePath,
		factory: (bridge: WorkerBridge, ref: JSONFileReference) => Promise<T>,
	): Promise<T> {
		const {server} = this;
		const owner = await server.fileAllocator.getOrAssignOwner(path);
		const startMtime = server.memoryFs.maybeGetMtime(path);
		const lock = await server.fileLocker.getLock(path.join());
		const ref = server.projectManager.getTransportFileReference(path);

		const marker = this.startMarker({
			label: `${method}: ${ref.relative}`,
			facet: method,
			rowId: `worker ${owner.id}`,
		});

		try {
			const res: T = await factory(owner.bridge, ref);
			this.endMarker(marker);
			return res;
		} catch (err) {
			let diagnostics = getDiagnosticsFromError(err);

			if (diagnostics === undefined) {
				const diag = deriveDiagnosticFromError(
					err,
					{
						description: {
							category: "internalError/request",
						},
					},
				);

				throw createSingleDiagnosticError({
					...diag,
					description: {
						...diag.description,
						advice: [
							...diag.description.advice,
							{
								type: "log",
								category: "info",
								text: markup`Error occurred while requesting <emphasis>${method}</emphasis> for <filelink emphasis target="${ref.uid}" />`,
							},
						],
					},
				});
			} else {
				// We don't want to tamper with these
				throw err;
			}
		} finally {
			lock.release();

			const endMtime = this.server.memoryFs.maybeGetMtime(path);
			if (endMtime !== startMtime) {
				return this.wrapRequestDiagnostic(method, path, factory);
			}
		}
	}

	async requestWorkerUpdateBuffer(
		path: AbsoluteFilePath,
		content: string,
	): Promise<void> {
		this.checkCancelled();

		await this.wrapRequestDiagnostic(
			"updateBuffer",
			path,
			async (bridge, file) => {
				await bridge.updateBuffer.call({file, content});
				this.server.memoryFs.addBuffer(path, content);
				this.server.refreshFileEvent.send(path);
			},
		);
	}

	async requestWorkerClearBuffer(path: AbsoluteFilePath): Promise<void> {
		this.checkCancelled();

		await this.wrapRequestDiagnostic(
			"updateBuffer",
			path,
			async (bridge, file) => {
				await bridge.clearBuffer.call({file});
				this.server.memoryFs.clearBuffer(path);
				this.server.refreshFileEvent.send(path);
			},
		);
	}

	async requestWorkerParse(
		path: AbsoluteFilePath,
		opts: WorkerParseOptions,
	): Promise<JSRoot> {
		this.checkCancelled();

		return this.wrapRequestDiagnostic(
			"parse",
			path,
			(bridge, file) => bridge.parse.call({file, options: opts}),
		);
	}

	async requestWorkerUpdateInlineSnapshots(
		path: AbsoluteFilePath,
		updates: InlineSnapshotUpdates,
		parseOptions: WorkerParseOptions,
	): Promise<Diagnostics> {
		this.checkCancelled();

		return this.wrapRequestDiagnostic(
			"updateInlineSnapshots",
			path,
			(bridge, file) =>
				bridge.updateInlineSnapshots.call({file, updates, parseOptions})
			,
		);
	}

	async requestWorkerLint(
		path: AbsoluteFilePath,
		optionsWithoutModSigs: Omit<WorkerLintOptions, "prefetchedModuleSignatures">,
	): Promise<WorkerLintResult> {
		this.checkCancelled();

		const {cache} = this.server;
		const cacheEntry = await cache.get(path);

		const cacheKey = hash(optionsWithoutModSigs);
		const cached = cacheEntry.lint[cacheKey];
		if (cached !== undefined) {
			return cached;
		}

		const prefetchedModuleSignatures = await this.maybePrefetchModuleSignatures(
			path,
		);

		const options: WorkerLintOptions = {
			...optionsWithoutModSigs,
			prefetchedModuleSignatures,
		};

		const res = await this.wrapRequestDiagnostic(
			"lint",
			path,
			(bridge, file) => bridge.lint.call({file, options, parseOptions: {}}),
		);

		await cache.update(
			path,
			(cacheEntry) => ({
				lint: {
					...cacheEntry.lint,
					[cacheKey]: res,
				},
			}),
		);

		return res;
	}

	async requestWorkerFormat(
		path: AbsoluteFilePath,
		parseOptions: WorkerParseOptions,
	): Promise<undefined | WorkerFormatResult> {
		this.checkCancelled();

		return await this.wrapRequestDiagnostic(
			"format",
			path,
			(bridge, file) => bridge.format.call({file, parseOptions}),
		);
	}

	async requestWorkerCompile(
		path: AbsoluteFilePath,
		stage: TransformStageName,
		options: WorkerCompilerOptions,
		parseOptions: WorkerParseOptions,
	): Promise<WorkerCompileResult> {
		this.checkCancelled();

		const {cache} = this.server;

		// Create a cache key comprised of the stage and hash of the options
		const cacheKey = `${stage}:${hash(options)}`;

		// Check cache for this stage and options
		const cacheEntry = await cache.get(path);
		const cached = cacheEntry.compile[cacheKey];
		if (cached !== undefined) {
			// TODO check cacheDependencies
			return cached;
		}

		const compileRes = await this.wrapRequestDiagnostic(
			"compile",
			path,
			(bridge, file) => {
				// We allow options to be passed in as undefined so we can compute an easy cache key
				if (options === undefined) {
					options = {};
				}

				return bridge.compile.call({file, stage, options, parseOptions});
			},
		);

		const res = this.normalizeCompileResult({
			...compileRes,
			cached: false,
		});

		// There's a race condition here between the file being opened and then rewritten
		await cache.update(
			path,
			(cacheEntry) => ({
				compile: {
					...cacheEntry.compile,
					[cacheKey]: {
						...res,
						cached: true,
					},
				},
			}),
		);

		return res;
	}

	async requestWorkerAnalyzeDependencies(
		path: AbsoluteFilePath,
		parseOptions: WorkerParseOptions,
	): Promise<WorkerAnalyzeDependencyResult> {
		this.checkCancelled();

		const {cache} = this.server;

		const cacheEntry = await cache.get(path);
		if (cacheEntry.analyzeDependencies !== undefined) {
			return cacheEntry.analyzeDependencies;
		}

		const res = await this.wrapRequestDiagnostic(
			"analyzeDependencies",
			path,
			(bridge, file) => bridge.analyzeDependencies.call({file, parseOptions}),
		);
		await cache.update(
			path,
			{
				analyzeDependencies: {
					...res,
					cached: true,
				},
			},
		);

		return {
			...res,
			cached: false,
		};
	}

	async requestWorkerModuleSignature(
		path: AbsoluteFilePath,
		parseOptions: WorkerParseOptions,
	): Promise<ModuleSignature> {
		this.checkCancelled();

		const {cache} = this.server;

		const cacheEntry = await cache.get(path);
		if (cacheEntry.moduleSignature !== undefined) {
			return cacheEntry.moduleSignature;
		}

		const res = await this.wrapRequestDiagnostic(
			"moduleSignature",
			path,
			(bridge, file) => bridge.moduleSignatureJS.call({file, parseOptions}),
		);
		await cache.update(
			path,
			{
				moduleSignature: res,
			},
		);
		return res;
	}

	async maybePrefetchModuleSignatures(
		path: AbsoluteFilePath,
	): Promise<PrefetchedModuleSignatures> {
		this.checkCancelled();

		const {projectManager} = this.server;

		const prefetchedModuleSignatures: PrefetchedModuleSignatures = {};
		const project = await projectManager.assertProject(path);
		if (project.config.typeCheck.enabled === false) {
			return prefetchedModuleSignatures;
		}

		// get the owner of this file

		/*const rootOwner = await fileAllocator.getOrAssignOwner(filename);
    const rootOwnerId = workerManager.getIdFromBridge(rootOwner);

    // absolute filenames to redupe export graphs
    const absoluteFilenameToGraphKey: Map<string, string> = new Map();

    // TODO exclude graphs that aren't a part of the root graph
    for (const dep of await dependencyGraph.getTransitiveDependencies(
      filename,
    )) {
      const key = `${dep.origin}:${dep.relative}`;
      const absolute = dep.absoluteMocked;

      // TODO check if we have this graph by another key and point to it if necessary
      const existingEntryKey = absoluteFilenameToGraphKey.get(absolute);
      if (existingEntryKey !== undefined) {
        invariant(existingEntryKey !== key, 'duplicate transitive dependency key %s', key);
        prefetchedModuleSignatures[key] = {
          type: 'POINTER',
          key: existingEntryKey,
        };
        continue;
      }

      // set the key so we point to the value instead of reproducing the whole graph
      absoluteFilenameToGraphKey.set(absolute, key);

      // fetch the owner so we can leave out graphs owned by the worker
      const owner = await fileAllocator.getOrAssignOwner(absolute);
      if (owner === rootOwner) {
        const project = await projectManager.assertProject(absolute);
        prefetchedModuleSignatures[key] = {
          type: 'OWNED',
          filename: absolute,
          projectId: project.id,
        };
        continue;
      }

      // get mtime so we can use it for a cache
      const mtime = this.server.memoryFs.getMtime(absolute);

      // check if this worker has it cached
      // TODO figure out some way to evict this on file deletion
      const cacheKey = `moduleSignature:${absolute}`;
      const cachedMtime = workerManager.getValueFromWorkerCache(
        rootOwnerId,
        cacheKey,
      );
      if (cachedMtime === mtime) {
        prefetchedModuleSignatures[key] = {
          type: 'USE_CACHED',
          filename: absolute,
        };
        continue;
      } else {
        workerManager.setWorkerCacheValue(rootOwnerId, cacheKey, mtime);
      }

      // calculate the graph
      const graph = await this.moduleSignature(absolute);
      prefetchedModuleSignatures[key] = {
        type: 'RESOLVED',
        graph,
      };
    }*/
		return prefetchedModuleSignatures;
	}
}
