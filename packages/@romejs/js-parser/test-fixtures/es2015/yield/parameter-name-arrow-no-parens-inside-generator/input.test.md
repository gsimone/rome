# `index.test.ts`

**DO NOT MODIFY**. This file has been autogenerated. Run `rome test packages/@romejs/js-parser/index.test.ts --update-snapshots` to update.

## `es2015 > yield > parameter-name-arrow-no-parens-inside-generator`

```javascript
JSRoot {
	comments: Array []
	corrupt: true
	directives: Array []
	filename: "input.js"
	hasHoistedVars: false
	interpreter: undefined
	mtime: undefined
	sourceType: "script"
	syntax: Array []
	loc: Object {
		filename: "input.js"
		end: Object {
			column: 1
			index: 33
			line: 3
		}
		start: Object {
			column: 0
			index: 0
			line: 1
		}
	}
	diagnostics: Array [
		Object {
			origins: Array [Object {category: "js-parser"}]
			description: Object {
				advice: Array []
				category: "parse/js"
				message: PARTIAL_BLESSED_DIAGNOSTIC_MESSAGE {value: "Expected a semicolon or a line terminator"}
			}
			location: Object {
				filename: "input.js"
				mtime: undefined
				sourceType: "script"
				end: Object {
					column: 7
					index: 24
					line: 2
				}
				start: Object {
					column: 8
					index: 25
					line: 2
				}
			}
		}
	]
	body: Array [
		JSFunctionDeclaration {
			id: JSBindingIdentifier {
				name: "fn"
				loc: Object {
					filename: "input.js"
					identifierName: "fn"
					end: Object {
						column: 12
						index: 12
						line: 1
					}
					start: Object {
						column: 10
						index: 10
						line: 1
					}
				}
			}
			loc: Object {
				filename: "input.js"
				end: Object {
					column: 1
					index: 33
					line: 3
				}
				start: Object {
					column: 0
					index: 0
					line: 1
				}
			}
			head: JSFunctionHead {
				async: false
				generator: true
				hasHoistedVars: false
				params: Array []
				rest: undefined
				returnType: undefined
				thisType: undefined
				typeParameters: undefined
				loc: Object {
					filename: "input.js"
					end: Object {
						column: 14
						index: 14
						line: 1
					}
					start: Object {
						column: 12
						index: 12
						line: 1
					}
				}
			}
			body: JSBlockStatement {
				directives: Array []
				loc: Object {
					filename: "input.js"
					end: Object {
						column: 1
						index: 33
						line: 3
					}
					start: Object {
						column: 15
						index: 15
						line: 1
					}
				}
				body: Array [
					JSExpressionStatement {
						loc: Object {
							filename: "input.js"
							end: Object {
								column: 7
								index: 24
								line: 2
							}
							start: Object {
								column: 2
								index: 19
								line: 2
							}
						}
						expression: JSYieldExpression {
							argument: undefined
							delegate: false
							loc: Object {
								filename: "input.js"
								end: Object {
									column: 7
									index: 24
									line: 2
								}
								start: Object {
									column: 2
									index: 19
									line: 2
								}
							}
						}
					}
					JSExpressionStatement {
						loc: Object {
							filename: "input.js"
							end: Object {
								column: 10
								index: 27
								line: 2
							}
							start: Object {
								column: 8
								index: 25
								line: 2
							}
						}
						expression: JSReferenceIdentifier {
							name: "INVALID_PLACEHOLDER"
							loc: Object {
								filename: "input.js"
								end: Object {
									column: 10
									index: 27
									line: 2
								}
								start: Object {
									column: 8
									index: 25
									line: 2
								}
							}
						}
					}
					JSBlockStatement {
						body: Array []
						directives: Array []
						loc: Object {
							filename: "input.js"
							end: Object {
								column: 13
								index: 30
								line: 2
							}
							start: Object {
								column: 11
								index: 28
								line: 2
							}
						}
					}
					JSEmptyStatement {
						loc: Object {
							filename: "input.js"
							end: Object {
								column: 14
								index: 31
								line: 2
							}
							start: Object {
								column: 13
								index: 30
								line: 2
							}
						}
					}
				]
			}
		}
	]
}
```
