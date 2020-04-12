import { chooser } from '../../src';
import testCases from './test-cases';
import { deepStrictEqual } from 'assert';

describe('choice', () => {
  testCases.forEach(({ choices, input, expected, defaultValue, equalityFn }) => {
    test(`returns ${expected} with input ${JSON.stringify(
      input,
    )} and choices ${JSON.stringify(choices)}`, () => {
      deepStrictEqual(chooser(choices, defaultValue, equalityFn)(input), expected);
    });
  });
});
