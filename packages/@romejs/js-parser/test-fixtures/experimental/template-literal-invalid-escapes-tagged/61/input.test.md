# `index.test.ts`

**DO NOT MODIFY**. This file has been autogenerated. Run `rome test packages/@romejs/js-parser/index.test.ts --update-snapshots` to update.

## `experimental > template-literal-invalid-escapes-tagged > 61`

```javascript
JSRoot {
	comments: Array []
	corrupt: false
	diagnostics: Array []
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
	body: Array [
		JSExpressionStatement {
			loc: Object {
				filename: "input.js"
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
			expression: JSTaggedTemplateExpression {
				typeArguments: undefined
				loc: Object {
					filename: "input.js"
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
				tag: JSReferenceIdentifier {
					name: "sampleTag"
					loc: Object {
						filename: "input.js"
						identifierName: "sampleTag"
						end: Object {
							column: 9
							index: 9
							line: 1
						}
						start: Object {
							column: 0
							index: 0
							line: 1
						}
					}
				}
				quasi: JSTemplateLiteral {
					expressions: Array []
					loc: Object {
						filename: "input.js"
						end: Object {
							column: 19
							index: 19
							line: 1
						}
						start: Object {
							column: 9
							index: 9
							line: 1
						}
					}
					quasis: Array [
						JSTemplateElement {
							cooked: "\\u{\\u{0}"
							raw: "\\u{\\u{0}"
							tail: true
							loc: Object {
								filename: "input.js"
								end: Object {
									column: 18
									index: 18
									line: 1
								}
								start: Object {
									column: 10
									index: 10
									line: 1
								}
							}
						}
					]
				}
			}
		}
	]
}
```
