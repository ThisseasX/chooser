const chooser = require('../..');
const { callTimes } = require('./util');
const { deepStrictEqual } = require('assert');

const callCount = {
  1: 0,
  2: 0,
};

const fn = (n) => {
  callCount[n]++;
  return n;
};

const choose = chooser(() => [
  { when: 1, then: () => fn(1) },
  { when: 2, then: () => fn(2) },
]);

describe('all lazy demo', () => {
  test('is accurate', () => {
    callTimes(choose, 3, 1);

    deepStrictEqual(callCount, {
      1: 3,
      2: 0,
    });
  });
});
