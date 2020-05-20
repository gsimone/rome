# `noUnsafe.test.ts`

**DO NOT MODIFY**. This file has been autogenerated. Run `rome test packages/@romejs/js-compiler/lint/rules/react/noUnsafe.test.ts --update-snapshots` to update.

## `no unsafe`

### `0`

```

 unknown:3:10 lint/react/noUnsafe ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ UNSAFE_componentWillMount is unsafe for use in async rendering. Update the component to use
    componentDidMount instead. See 
    https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.

    2 │         class Hello extends React.Component {
  > 3 │           UNSAFE_componentWillMount() {}
      │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    4 │         }
    5 │     

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `0: formatted`

```
class Hello extends React.Component {
	UNSAFE_componentWillMount() {}
}

```

### `1`

```

 unknown:3:10 lint/react/noUnsafe ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ UNSAFE_componentWillReceiveProps is unsafe for use in async rendering. Update the component to
    use getDerivedStateFromProps instead. See 
    https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.

    2 │         class Hello extends React.Component {
  > 3 │           UNSAFE_componentWillReceiveProps() {}
      │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    4 │         }
    5 │     

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `1: formatted`

```
class Hello extends React.Component {
	UNSAFE_componentWillReceiveProps() {}
}

```

### `2`

```

 unknown:3:10 lint/react/noUnsafe ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ UNSAFE_componentWillUpdate is unsafe for use in async rendering. Update the component to use
    componentDidUpdate instead. See 
    https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.

    2 │         class Hello extends React.Component {
  > 3 │           UNSAFE_componentWillUpdate() {}
      │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    4 │         }
    5 │         

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `2: formatted`

```
class Hello extends React.Component {
	UNSAFE_componentWillUpdate() {}
}

```

### `3`

```
✔ No known problems!

```

### `3: formatted`

```
class Hello extends React.Component {
	componentDidMount() {}
}

```