# `index.test.ts`

**DO NOT MODIFY**. This file has been autogenerated. Run `rome test packages/@romejs/js-parser/index.test.ts --update-snapshots` to update.

## `core > uncategorised > 55`

```javascript
JSRoot {
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
			column: 18
			index: 18
			line: 1
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
			value: " line comment"
			loc: Object {
				filename: "input.js"
				end: Object {
					column: 18
					index: 18
					line: 1
				}
				start: Object {
					column: 3
					index: 3
					line: 1
				}
			}
		}
	]
	body: Array [
		JSExpressionStatement {
			trailingComments: Array ["0"]
			loc: Object {
				filename: "input.js"
				end: Object {
					column: 2
					index: 2
					line: 1
				}
				start: Object {
					column: 0
					index: 0
					line: 1
				}
			}
			expression: JSNumericLiteral {
				value: 42
				format: undefined
				trailingComments: undefined
				loc: Object {
					filename: "input.js"
					end: Object {
						column: 2
						index: 2
						line: 1
					}
					start: Object {
						column: 0
						index: 0
						line: 1
					}
				}
			}
		}
	]
}
```
