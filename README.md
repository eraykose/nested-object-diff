<div align="center">
  <h1>Nested Object Diff</h1>
  
[![MIT License](https://img.shields.io/npm/l/nested-object-diff?style=flat-square)](https://github.com/eraykose/nested-object-diff/blob/master/LICENSE)
[![version](https://img.shields.io/npm/v/nested-object-diff?style=flat-square)](https://www.npmjs.com/package/nested-object-diff)
</div>

A lightweight javascript diff library for comparing two javascript object nested with supporting matching by value of the object's choosen key name in array.

## Installation

`npm i --save nested-object-diff`

## Importing

NodeJs / ES5:

```js
var diff = require("nested-object-diff").diff;
```

ES6 / Babel:

```js
import { diff } from "nested-object-diff";
```

## Usage:

```js
var diff = require("./dist/index").diff;

var lhs = {
  shop: {
    products: [{ id: 1, name: "a" }, { id: 2, name: "b" }, { id: 3, name: "c" }]
  },
  name: "foo"
};

var rhs = {
  shop: {
    products: [
      { id: 1, name: "a" },
      { id: 2, name: "bb" },
      { id: 4, name: "d" },
      { id: 3, name: "cc" }
    ]
  },
  name: "baz"
};

var differences = diff(lhs, rhs, { matchKey: "id" });
```

The code snippet above would result in the following structure describing the differences:

```js
[
  { type: "E", path: "shop.products.1.name", lhs: "b", rhs: "bb" },
  { type: "E", path: "shop.products.3.name", lhs: "c", rhs: "cc" },
  { type: "A", path: "shop.products.2", rhs: { id: 4, name: "d" } },
  { type: "E", path: "name", lhs: "foo", rhs: "baz" }
];
```

### Function Arguments

- `lhs` - the left-hand operand; the origin object.
- `rhs` - the right-hand operand; the object being compared structurally with the origin object.
- `options` - A configuration object that can have the following properties:
  - `matchKey`: used to match objects when diffing arrays, by default only === operator is used

### Differences

Differences are reported as one or more change records. Change records have the following structure:

- `type` - indicates the kind of change; will be one of the following:
  - `A` - indicates a newly added property
  - `D` - indicates a property was deleted
  - `E` - indicates a property was edited
- `path` - the property path
- `lhs` - the value on the left-hand-side of the comparison (undefined if kind === 'A')
- `rhs` - the value on the right-hand-side of the comparison (undefined if kind === 'D')

## Contributing

You discovered a bug or have an idea for a new feature? Great, why don't you send me a PR or open an issue so everyone can benefit from it?
If you decide to send PR please run the unit tests before submitting your PR: `npm test`. Hopefully your PR includes additional unit tests to illustrate your changemodification!

## License

MIT
