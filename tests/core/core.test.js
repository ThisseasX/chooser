const chooser = require('../..');
const testCases = require('./test-cases');
const { deepStrictEqual } = require('assert');

describe('choice', () => {
  testCases.forEach(({ choices, input, expected, defaultValue, equalityFn }) => {
    test(`returns ${expected} with input ${input} and choices ${JSON.stringify(
      choices,
    )}`, () => {
      deepStrictEqual(chooser(choices, defaultValue, equalityFn)(input), expected);
    });
  });
});
