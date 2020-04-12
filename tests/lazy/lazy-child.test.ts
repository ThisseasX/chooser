import chooser from '../../src';
import { callTimes } from './util';
import { deepStrictEqual } from 'assert';

const callCount = {
  1: 0,
  2: 0,
};

const fn = (n) => {
  callCount[n]++;
  return n;
};

const choose = chooser([
  { when: 1, then: () => fn(1) },
  { when: 2, then: () => fn(2) },
]);

describe('lazy child demo', () => {
  test('is accurate', () => {
    callTimes(choose, 3, 1);

    deepStrictEqual(callCount, {
      1: 3,
      2: 0,
    });
  });
});
