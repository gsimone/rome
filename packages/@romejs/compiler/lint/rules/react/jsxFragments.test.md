# `jsxFragments.test.ts`

**DO NOT MODIFY**. This file has been autogenerated. Run `rome test packages/@romejs/compiler/lint/rules/react/jsxFragments.test.ts --update-snapshots` to update.

## `react jsx fragments`

### `0`

```

 unknown:1 lint/react/jsxFragments  FIXABLE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Use shorthand syntax for Fragment elements instead of standard syntax.

    <Fragment><Foo /><Foo /></Fragment>
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  ℹ Shorthand fragment syntax saves keystrokes and is only unapplicable when keys are required.

  ℹ Recommended fix

  - <Fragment><Foo /><Foo /></Fragment>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `0: formatted`

```
<><Foo /><Foo /></>;

```

### `1`

```

 unknown:1 lint/react/jsxFragments  FIXABLE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Use shorthand syntax for Fragment elements instead of standard syntax.

    <React.Fragment><Foo /><Foo /></React.Fragment>
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  ℹ Shorthand fragment syntax saves keystrokes and is only unapplicable when keys are required.

  ℹ Recommended fix

  - <React.Fragment><Foo /><Foo /></React.Fragment>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `1: formatted`

```
<><Foo /><Foo /></>;

```

### `2`

```

 unknown:1:19 lint/react/jsxFragments  FIXABLE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Use shorthand syntax for Fragment elements instead of standard syntax.

    const Hello = <div><Fragment><Foo /><Foo /></Fragment></div>
                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  ℹ Shorthand fragment syntax saves keystrokes and is only unapplicable when keys are required.

  ℹ Recommended fix

  - <Fragment><Foo /><Foo /></Fragment>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `2: formatted`

```
const Hello = <div><Foo /><Foo /></div>;

```

### `3`

```

 unknown:1:19 lint/react/jsxFragments  FIXABLE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Use shorthand syntax for Fragment elements instead of standard syntax.

    const Hello = <div><React.Fragment><Foo /><Foo /></React.Fragment></div>
                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  ℹ Shorthand fragment syntax saves keystrokes and is only unapplicable when keys are required.

  ℹ Recommended fix

  - <React.Fragment><Foo /><Foo /></React.Fragment>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `3: formatted`

```
const Hello = <div><Foo /><Foo /></div>;

```

### `4`

```

 unknown:1:14 lint/react/jsxFragments  FIXABLE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Use shorthand syntax for Fragment elements instead of standard syntax.

    const Hello = <React.Fragment><Foo /><Foo /></React.Fragment>
                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  ℹ Shorthand fragment syntax saves keystrokes and is only unapplicable when keys are required.

  ℹ Recommended fix

  - <React.Fragment><Foo /><Foo /></React.Fragment>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `4: formatted`

```
const Hello = <><Foo /><Foo /></>;

```

### `5`

```

 unknown:1:14 lint/react/jsxFragments  FIXABLE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Use shorthand syntax for Fragment elements instead of standard syntax.

    const Hello = <Fragment><Foo /><Foo /></Fragment>
                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  ℹ Shorthand fragment syntax saves keystrokes and is only unapplicable when keys are required.

  ℹ Recommended fix

  - <Fragment><Foo /><Foo /></Fragment>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `5: formatted`

```
const Hello = <><Foo /><Foo /></>;

```

### `6`

```

 unknown:3:16 lint/react/jsxFragments  FIXABLE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Use shorthand syntax for Fragment elements instead of standard syntax.

    2 │      function Foo() {
  > 3 │       let bar = <React.Fragment><Foo /><Foo /></React.Fragment>;
      │                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    4 │       return bar;
    5 │      } 

  ℹ Shorthand fragment syntax saves keystrokes and is only unapplicable when keys are required.

  ℹ Recommended fix

  - <React.Fragment><Foo /><Foo /></React.Fragment>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `6: formatted`

```
function Foo() {
	let bar = <><Foo /><Foo /></>;
	return bar;
}

```

### `7`

```

 unknown:3:16 lint/react/jsxFragments  FIXABLE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Use shorthand syntax for Fragment elements instead of standard syntax.

    2 │      function Foo() {
  > 3 │       let bar = <Fragment><Foo /><Foo /></Fragment>;
      │                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    4 │       return bar;
    5 │      } 

  ℹ Shorthand fragment syntax saves keystrokes and is only unapplicable when keys are required.

  ℹ Recommended fix

  - <Fragment><Foo /><Foo /></Fragment>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `7: formatted`

```
function Foo() {
	let bar = <><Foo /><Foo /></>;
	return bar;
}

```

### `8`

```

 unknown:3:13 lint/react/jsxFragments  FIXABLE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Use shorthand syntax for Fragment elements instead of standard syntax.

    2 │      function Hello() {
  > 3 │       return <React.Fragment><Foo /><Foo /></React.Fragment>
      │              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    4 │      }
    5 │      

  ℹ Shorthand fragment syntax saves keystrokes and is only unapplicable when keys are required.

  ℹ Recommended fix

  - <React.Fragment><Foo /><Foo /></React.Fragment>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `8: formatted`

```
function Hello() {
	return <><Foo /><Foo /></>;
}

```

### `9`

```

 unknown:2:13 lint/react/jsxFragments  FIXABLE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Use shorthand syntax for Fragment elements instead of standard syntax.

    1 │ function Hello() {
  > 2 │       return <Fragment><Foo /><Foo /></Fragment>
      │              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 │      }
    4 │      

  ℹ Shorthand fragment syntax saves keystrokes and is only unapplicable when keys are required.

  ℹ Recommended fix

  - <Fragment><Foo /><Foo /></Fragment>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `9: formatted`

```
function Hello() {
	return <><Foo /><Foo /></>;
}

```

### `10`

```

 unknown:1:20 lint/react/jsxFragments  FIXABLE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Use shorthand syntax for Fragment elements instead of standard syntax.

    const Hello = () => <React.Fragment><Foo /><Foo /></React.Fragment>
                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  ℹ Shorthand fragment syntax saves keystrokes and is only unapplicable when keys are required.

  ℹ Recommended fix

  - <React.Fragment><Foo /><Foo /></React.Fragment>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `10: formatted`

```
function Hello() {
	return <><Foo /><Foo /></>;
}

```

### `11`

```

 unknown:1:20 lint/react/jsxFragments  FIXABLE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ Use shorthand syntax for Fragment elements instead of standard syntax.

    const Hello = () => <Fragment><Foo /><Foo /></Fragment>
                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  ℹ Shorthand fragment syntax saves keystrokes and is only unapplicable when keys are required.

  ℹ Recommended fix

  - <Fragment><Foo /><Foo /></Fragment>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `11: formatted`

```
function Hello() {
	return <><Foo /><Foo /></>;
}

```

### `12`

```
✔ No known problems!

```

### `12: formatted`

```
<><Foo /><Foo /></>;

```

### `13`

```
✔ No known problems!

```

### `13: formatted`

```
<Fragment key='id'></Fragment>;

```

### `14`

```
✔ No known problems!

```

### `14: formatted`

```
<React.Fragment key='id'><Foo /></React.Fragment>;

```

### `15`

```
✔ No known problems!

```

### `15: formatted`

```
const Hello = <div><Fragment key='word'><Foo /></Fragment></div>;

```

### `16`

```
✔ No known problems!

```

### `16: formatted`

```
const Hello = <>hello</>;

```

### `17`

```
✔ No known problems!

```

### `17: formatted`

```
const Hello = <Fragment key='id'><Foo /></Fragment>;

```

### `18`

```
✔ No known problems!

```

### `18: formatted`

```
const Hello = <React.Fragment key='id'><Foo /></React.Fragment>;

```

### `19`

```
✔ No known problems!

```

### `19: formatted`

```
function Foo() {
	let bar = <React.Fragment key='word'></React.Fragment>;
	return bar;
}

```

### `20`

```
✔ No known problems!

```

### `20: formatted`

```
function Hello() {
	return <React.Fragment key='id'><Foo /></React.Fragment>;
}

```

### `21`

```
✔ No known problems!

```

### `21: formatted`

```
function Hello() {
	return <Fragment key='id'><Foo /></Fragment>;
}

```

### `22`

```
✔ No known problems!

```

### `22: formatted`

```
function Hello() {
	return <></>;
}

```

### `23`

```
✔ No known problems!

```

### `23: formatted`

```
function Hello() {
	return <React.Fragment key='id'></React.Fragment>;
}

```

### `24`

```
✔ No known problems!

```

### `24: formatted`

```
function Hello() {
	return <Fragment key='id'></Fragment>;
}

```
