const chooser = require('../..');

const choose = chooser([
  { when: 1, then: () => 'one' },
  { when: 2, then: () => 'two' },
]);

choose(1); // => 'one'
choose(2); // => 'two'

///////////////////////////////////////////////////////////////////////////////
const { strictEqual } = require('assert');

describe('lazy demo', () => {
  test('is accurate', () => {
    strictEqual(choose(1), 'one');
    strictEqual(choose(2), 'two');
  });
});
