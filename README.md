# chooser

<p align="center">
  <a href="https://www.npmjs.com/package/chooser">
    <img src="https://img.shields.io/npm/v/chooser.svg" alt="npm version" >
  </a>
  <a href="https://packagephobia.now.sh/result?p=chooser">
    <img src="https://packagephobia.now.sh/badge?p=chooser" alt="install size" >
  </a>
  <a href="https://travis-ci.org/github/ThisseasX/chooser">
    <img src="https://travis-ci.org/ThisseasX/chooser.svg?branch=master" />
  </a>
  <a href="https://codecov.io/gh/ThisseasX/chooser">
    <img src="https://codecov.io/gh/ThisseasX/chooser/branch/master/graph/badge.svg" />
  </a>
  <a href="https://github.com/ThisseasX/chooser/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/chooser.svg" alt="license">
  </a>
  <a href="https://david-dm.org/ThisseasX/chooser">
    <img src="https://david-dm.org/ThisseasX/chooser/status.svg" alt="dependency status">
  </a>
</p>

A small, but fully featured, library that aims to replace `switch` case logic (mainly to aid with Functional Programming), with a simple declarative API for setting up a predefined map of cases, and choosing a result from it based on input.

# Features

- Map cases to results.
- Map multiple cases to the same result.
- Customize the equality function used to produce a match, either at case declaration, or at the time of input.
- Refer from one case to another by `ref`-ing its index.
- Refer from one case to another by `use`-ing its `when` value.
- Leverage the [lazy](https://en.wikipedia.org/wiki/Lazy_evaluation) nature of functions to compute a result only when needed, and not at the time of the case declaration.
- If a function is intended to be returned as is, it can be put under the `eager` key.
- Written in [TypeScript](https://www.typescriptlang.org/) and bundled with [Rollup](https://rollupjs.org/guide/en/), featuring:
  - A CommonJS module for node.
  - An ES Module for node.

# Installation

```sh
$ npm install chooser
```

# Usage

```js
const { chooser } = require('chooser');

const choose = chooser([
  { when: [1, 2], then: 'one' },
  { when: 3, then: 'two' },
  { when: 4, ref: 0 },
  { when: 5, use: 3 },
]);

choose(1); // => 'one'
choose(2); // => 'one'
choose(3); // => 'two'
choose(4); // => 'one'
choose(5); // => 'two'
```

# Terminology

### Choices

The `choices` parameter should be either a plain js object with keys (for cases) and values (for results), or an array of `choice` objects adhering to the `choice` schema.

### Choice

The `choice` objects are objects that adhere to the following schema:

```ts
type Choice = {
  when: any;
  then?: any;
  ref?: number;
  use?: any;
  eager?: Function;
};
```

# Examples

Basic example:

```js
const { chooser } = require('chooser');

const choose = chooser([
  { when: [1, 2], then: 'one' },
  { when: 3, then: 'two' },
  { when: 4, ref: 0 },
  { when: 5, use: 3 },
]);

choose(1); // => 'one'
choose(2); // => 'one'
choose(3); // => 'two'
choose(4); // => 'one'
choose(5); // => 'two'
```

Leveraging lazy evaluation:

```js
const { chooser } = require('chooser');

const choose = chooser([
  { when: 1, then: () => 'one' },
  { when: 2, then: () => 'two' },
]);

choose(1); // => 'one'
choose(2); // => 'two'
```

Overriding lazy evaluation to return the function as is:

```js
const { chooser } = require('chooser');

const fn = () => 'one';

const choose = chooser([
  { when: 1, then: fn },
  { when: 2, eager: fn },
]);

choose(1); // => 'one'
choose(2); // => Function: fn
```

Using a plain object:

```js
const { chooser } = require('chooser');

const choose = chooser({
  1: 'one',
  2: 'two',
});

choose(1); // => 'one'
choose('1'); // => 'one'
choose(2); // => 'two'
choose('2'); // => 'two'
```

> **Note**: When using a plain object without specifying an `equalityFn` (see below), the input is automatically converted to a string.

Using `use` shorthand in plain objects:

```js
const choose = chooser({
  1: 'one',
  2: 'two',
  3: '{#2}',
});

choose(1); // => 'one'
choose(2); // => 'two'
choose(3); // => 'two'
```

Using `ref` shorthand in plain objects:

```js
const { chooser } = require('chooser');

const choose = chooser({
  1: 'one',
  2: 'two',
  3: '{$0}',
});

choose(1); // => 'one'
choose(2); // => 'two'
choose(3); // => 'one'
```

> **Note**: A caveat of using a plain object as `choices` is that in the case of numbered keys, the keys are automatically sorted by the language. This can lead to wrong `ref`s.

Demonstrating the sorted keys problem:

```js
const { chooser } = require('chooser');

const choose = chooser({
  2: 'two',
  1: 'one',
  3: '{$0}',
});

choose(3); // => 'one' instead of the usually expected 'two'
```

Providing a custom `equalityFn` at case declaration:

```js
const { chooser } = require('chooser');

const equalityFn = (input, when) => input.nested.value == when;

const choose = chooser(
  [
    { when: 1, then: 'one' },
    { when: 2, then: 'two' },
  ],
  undefined,
  equalityFn,
);

const obj1 = { nested: { value: 1 } };
const obj2 = { nested: { value: 2 } };

choose(obj1); // => 'one'
choose(obj2); // => 'two'
```

Providing a custom `equalityFn` at the time of input:

```js
const equalityFnPerson = (input, when) => input.person.age == when;
const equalityFnDog = (input, when) => input.dog.age == when;

const choose = chooser([
  { when: 28, then: 'I am 28 years old!' },
  { when: 2, then: 'Woof woof!' },
]);

const data = {
  person: { age: 28 },
  dog: { age: 2 },
};

choose(data, equalityFnPerson); // => 'I am 28 years old!'
choose(data, equalityFnDog); // => 'Woof woof!'
```

Specifying a `defaultValue`:

```js
const { chooser } = require('chooser');

const choose = chooser(
  [
    { when: 1, then: 'one' },
    { when: 2, then: 'two' },
  ],
  'default string',
);

choose(3); // => 'default string'
```

# Closing Notes

Thank you for using this library. I hope it helps you write better, more declarative code, without any duplication or resorting to functions with `switch` cases or mapper functions.
