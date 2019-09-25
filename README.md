<div align="center">
  <h1>Nested Object Diff</h1>
  
[![MIT License](https://img.shields.io/npm/l/nested-object-diff?style=flat-square)](https://github.com/eraykose/nested-object-diff/blob/master/LICENSE)
[![version](https://img.shields.io/npm/v/nested-object-diff?style=flat-square)](https://www.npmjs.com/package/nested-object-diff)
</div>

A lightweight javascript diff library for comparing two javascript object nested with supporting matching by value of the object's choosen key name in array.

## Installation

```js
npm i --save nested-object-diff
```

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
    products: [
      { id: 1, name: "a" }, 
      { id: 2, name: "b" }, 
      { id: 3, name: "c" }
    ]
  },
  name: "foo"
};

var rhs = {
  shop: {
    products: [
      { id: 1, name: 'a' },
      { id: 4, name: 'd' },
      { id: 5, name: 'e' },
      { id: 3, name: 'cc' }
    ]
  },
  name: "baz"
};

var differences = diff(lhs, rhs);

//The code snippet above would result only added and deleted propery/element in the following structure describing the differences:
[
  { type: 'A', path: 'shop.products.3', rhs: { id: 3, name: 'cc' } },
  { type: 'E', path: 'shop.products.2.id', lhs: 3, rhs: 5 },
  { type: 'E', path: 'shop.products.2.name', lhs: 'c', rhs: 'e' },
  { type: 'E', path: 'shop.products.1.id', lhs: 2, rhs: 4 },
  { type: 'E', path: 'shop.products.1.name', lhs: 'b', rhs: 'd' },
  { type: 'E', path: 'name', lhs: 'foo', rhs: 'baz' }
]
```
With match options

```js
var differences = diff(lhs, rhs, { matchKey: 'id' });

//The code snippet above would result in the following structure describing the differences:
[
  { type: 'D', path: 'shop.products', lhs: { id: 2, name: 'b' } },
  { type: 'M', path: 'shop.products', item: { id: 3, name: 'c' }, lhsIndex: 2, rhsIndex: 3},
  { type: 'E', path: 'shop.products.3.name', lhs: 'c', rhs: 'cc' },
  { type: 'A', path: 'shop.products.1', rhs: { id: 4, name: 'd' } },
  { type: 'A', path: 'shop.products.2', rhs: { id: 5, name: 'e' } },
  { type: 'E', path: 'name', lhs: 'foo', rhs: 'baz' }
]
```

With types options

```js
var differences = diff(lhs, rhs, { matchKey: 'id', types:['A','D'] });

//The code snippet above would result only added and deleted propery/element in the following structure describing the differences:
[
  { type: 'D', path: 'shop.products', lhs: { id: 2, name: 'b' } },
  { type: 'A', path: 'shop.products.1', rhs: { id: 4, name: 'd' } },
  { type: 'A', path: 'shop.products.2', rhs: { id: 5, name: 'e' } }
]
```

### Function Arguments

- `lhs` - the left-hand operand; the origin object.
- `rhs` - the right-hand operand; the object being compared structurally with the origin object.
- `options` - A configuration object that can have the following properties:
  - `matchKey`: used to match objects when diffing arrays, by default only === operator is used; string
  - `types`: calculates differences for given types; array

### Differences

Differences are reported as one or more change records. Change records have the following structure:

- `type` - indicates the kind of change; will be one of the following:
  - `A` - indicates a newly added property/element
  - `D` - indicates a property/element was deleted
  - `E` - indicates a property/element was edited
  - `M` - indicates a property/element was moved
- `path` - the property/element path
- `item` - when type === 'M', contains a nested change record indicating the change that occurred at the array index
- `lhsIndex` - when type === 'M', indicates the left-hand-side array index 
- `rhsIndex` - when type === 'M', indicates the right-hand-side array index 
- `lhs` - the value on the left-hand-side of the comparison (undefined if kind === 'A')
- `rhs` - the value on the right-hand-side of the comparison (undefined if kind === 'D')

## Contributing

You discovered a bug or have an idea for a new feature? Great, why don't you send me a PR or open an issue so everyone can benefit from it?
If you decide to send PR please run the unit tests before submitting your PR: `npm test`. Hopefully your PR includes additional unit tests to illustrate your changemodification!

## License

MIT
