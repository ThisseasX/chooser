# chooser

A small, but fully featured, library that aims to completely replace `switch` case logic (which is unfavorable in Functional Programming), with a simple declarative API for setting up a predefined map of cases, and choosing a result from it based on input.

# Features

- Map cases to results.
- Map multiple cases to the same result.
- Refer from one case to another by `ref`-ing its index.
- Refer from one case to another by `use`-ing its `when` value.
- Leverage the [lazy](https://en.wikipedia.org/wiki/Lazy_evaluation) nature of functions to compute a result only when needed, and not at the time of the case declaration.
- If a function is intended to be returned as is, it can be put under the `eager` key.

# Installation

```sh
$ npm install chooser
```

# Usage

```js
const chooser = require('chooser');

const choose = chooser([
  { when: [1, 2], then: 'one' },
  { when: 3, then: 'two' },
  { when: 4, ref: 0 }
  { when: 5, use: 3 }
]);

choose(1) // => 'one'
choose(2) // => 'one'
choose(3) // => 'two'
choose(4) // => 'one'
choose(5) // => 'two'
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
const chooser = require('chooser');

const choose = chooser([
  { when: [1, 2], then: 'one' },
  { when: 3, then: 'two' },
  { when: 4, ref: 0 }
  { when: 5, use: 3 }
]);

choose(1) // => 'one'
choose(2) // => 'one'
choose(3) // => 'two'
choose(4) // => 'one'
choose(5) // => 'two'
```

Leveraging lazy evaluation:

```js
const chooser = require('chooser');

const choose = chooser([
  { when: 1, then: () => 'one' },
  { when: 2, then: () => 'two' },
]);

choose(1); // => 'one'
choose(2); // => 'two'
```

Overriding lazy evaluation to return the function as is:

```js
const chooser = require('chooser');

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
const chooser = require('chooser');

const choose = chooser({
  1: 'one',
  2: 'two',
});

choose(1); // => 'one'
choose('1'); // => 'one'
choose(2); // => 'two'
choose('2'); // => 'two'
```

> **Note**: When using a plain object, the input is automatically converted to a string.

Using special keys in plain objects:

```js
const chooser = require('chooser');

const choose = chooser({
  1: 'one',
  2: { ref: 0 },
  3: { use: 1 },
});

choose(1); // => 'one'
choose(2); // => 'one'
choose(3); // => 'one'
```

> **Note**: A caveat of using a plain object as `choices` is that in the case of numbered keys, the keys are automatically sorted by the language. This can lead to wrong `ref`s.

Demonstrating the sorted keys problem:

```js
const chooser = require('chooser');

const choose = chooser({
  2: 'two',
  1: 'one',
  3: { ref: 0 },
});

choose(3); // => 'one' instead of the usually expected 'two'
```

Using a plain object as a `choice` in an array of `choices`:

```js
const chooser = require('chooser');

const choose = chooser([
  { 1: 'one' }
  { 2: 'two' }
]);

choose(1); // => undefined
choose(2); // => undefined
choose('1'); // => 'one'
choose('2'); // => 'two'
```

> **Note**: If a `choice` object is created as a plain object (not recommended), the default strict equality function will not match its key if the input is a number, as object keys are always strings.

Instead it can be fixed by providing a non-strict equality function.

```js
const chooser = require('chooser');

const equalityFn = input => when => input == when;

const choose = chooser([
  { 1: 'one' }
  { 2: 'two' }
], undefined, equalityFn);

choose(1); // => 'one'
choose(2); // => 'two'
```

Another creative use of `equalityFn`:

```js
const chooser = require('chooser');

const equalityFn = (input) => (when) => input.nested.value == when;

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

Specifying a `defaultValue`:

```js
const chooser = require('chooser');

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

Thank you for using this library. I hope it helps you write better, declarative code, faster, without any duplication, or resorting to functions with `switch` cases, or very weak mapper functions.
