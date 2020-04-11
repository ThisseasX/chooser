const chooser = require('../..');

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

///////////////////////////////////////////////////////////////////////////////
const { strictEqual } = require('assert');

describe('equality demo', () => {
  test('is accurate', () => {
    strictEqual(choose(obj1), 'one');
    strictEqual(choose(obj2), 'two');
  });
});
