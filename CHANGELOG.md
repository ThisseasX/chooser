# chooser changelog

## 3.0.1

_2020-04-12_

Change default export to named export to fix broken CommonJS module types.

## 2.0.3

_2020-04-12_

Add [Travis CI](https://travis-ci.com/) and [Codecov](https://codecov.io/).

## 2.0.2

_2020-04-12_

Rewritten in [TypeScript](https://www.typescriptlang.org/) and bundled with [Rollup](https://rollupjs.org/guide/en/).

### Features

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
