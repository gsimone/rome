# `index.test.ts`

**DO NOT MODIFY**. This file has been autogenerated. Run `rome test packages/@romejs/js-parser/index.test.ts --update-snapshots` to update.

## `esprima > expression-left-hand-side > migrated_0019`

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
			column: 0
			index: 12
			line: 2
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
					column: 11
					index: 11
					line: 1
				}
				start: Object {
					column: 0
					index: 0
					line: 1
				}
			}
			expression: JSMemberExpression {
				loc: Object {
					filename: "input.js"
					end: Object {
						column: 11
						index: 11
						line: 1
					}
					start: Object {
						column: 0
						index: 0
						line: 1
					}
				}
				object: JSReferenceIdentifier {
					name: "universe"
					loc: Object {
						filename: "input.js"
						identifierName: "universe"
						end: Object {
							column: 8
							index: 8
							line: 1
						}
						start: Object {
							column: 0
							index: 0
							line: 1
						}
					}
				}
				property: JSStaticMemberProperty {
					value: JSIdentifier {
						name: "if"
						loc: Object {
							filename: "input.js"
							identifierName: "if"
							end: Object {
								column: 11
								index: 11
								line: 1
							}
							start: Object {
								column: 9
								index: 9
								line: 1
							}
						}
					}
					loc: Object {
						filename: "input.js"
						identifierName: "if"
						end: Object {
							column: 11
							index: 11
							line: 1
						}
						start: Object {
							column: 9
							index: 9
							line: 1
						}
					}
				}
			}
		}
	]
}
```
