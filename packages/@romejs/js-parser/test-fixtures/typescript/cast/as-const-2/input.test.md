# `index.test.ts`

**DO NOT MODIFY**. This file has been autogenerated. Run `rome test packages/@romejs/js-parser/index.test.ts --update-snapshots` to update.

## `typescript > cast > as-const-2`

```javascript
JSRoot {
	corrupt: false
	directives: Array []
	filename: "input.ts"
	hasHoistedVars: false
	interpreter: undefined
	mtime: undefined
	sourceType: "module"
	syntax: Array ["ts"]
	loc: Object {
		filename: "input.ts"
		end: Object {
			column: 0
			index: 30
			line: 2
		}
		start: Object {
			column: 0
			index: 0
			line: 1
		}
	}
	comments: Array [
		JSCommentLine {
			id: "0"
			value: " Error"
			loc: Object {
				filename: "input.ts"
				end: Object {
					column: 29
					index: 29
					line: 1
				}
				start: Object {
					column: 21
					index: 21
					line: 1
				}
			}
		}
	]
	diagnostics: Array [
		Object {
			origins: Array [Object {category: "js-parser"}]
			description: Object {
				advice: Array []
				category: "parse/js"
				message: PARTIAL_BLESSED_DIAGNOSTIC_MESSAGE {value: "Only literal values are allowed as a constant type"}
			}
			location: Object {
				filename: "input.ts"
				mtime: undefined
				sourceType: "module"
				end: Object {
					column: 9
					index: 9
					line: 1
				}
				start: Object {
					column: 8
					index: 8
					line: 1
				}
			}
		}
	]
	body: Array [
		JSVariableDeclarationStatement {
			trailingComments: Array ["0"]
			loc: Object {
				filename: "input.ts"
				end: Object {
					column: 19
					index: 19
					line: 1
				}
				start: Object {
					column: 0
					index: 0
					line: 1
				}
			}
			declaration: JSVariableDeclaration {
				kind: "let"
				trailingComments: undefined
				loc: Object {
					filename: "input.ts"
					end: Object {
						column: 19
						index: 19
						line: 1
					}
					start: Object {
						column: 0
						index: 0
						line: 1
					}
				}
				declarations: Array [
					JSVariableDeclarator {
						id: JSBindingIdentifier {
							name: "e"
							loc: Object {
								filename: "input.ts"
								identifierName: "e"
								end: Object {
									column: 5
									index: 5
									line: 1
								}
								start: Object {
									column: 4
									index: 4
									line: 1
								}
							}
						}
						loc: Object {
							filename: "input.ts"
							end: Object {
								column: 18
								index: 18
								line: 1
							}
							start: Object {
								column: 4
								index: 4
								line: 1
							}
						}
						init: TSAsExpression {
							loc: Object {
								filename: "input.ts"
								end: Object {
									column: 18
									index: 18
									line: 1
								}
								start: Object {
									column: 8
									index: 8
									line: 1
								}
							}
							expression: JSReferenceIdentifier {
								name: "v"
								loc: Object {
									filename: "input.ts"
									identifierName: "v"
									end: Object {
										column: 9
										index: 9
										line: 1
									}
									start: Object {
										column: 8
										index: 8
										line: 1
									}
								}
							}
							typeAnnotation: TSTypeReference {
								typeParameters: undefined
								loc: Object {
									filename: "input.ts"
									end: Object {
										column: 18
										index: 18
										line: 1
									}
									start: Object {
										column: 13
										index: 13
										line: 1
									}
								}
								typeName: JSReferenceIdentifier {
									name: "const"
									loc: Object {
										filename: "input.ts"
										identifierName: "const"
										end: Object {
											column: 18
											index: 18
											line: 1
										}
										start: Object {
											column: 13
											index: 13
											line: 1
										}
									}
								}
							}
						}
					}
				]
			}
		}
	]
}
```
