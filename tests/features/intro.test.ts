import chooser from '../../src';

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

///////////////////////////////////////////////////////////////////////////////
import { strictEqual } from 'assert';

describe('intro demo', () => {
  test('is accurate', () => {
    strictEqual(choose(1), 'one');
    strictEqual(choose(2), 'one');
    strictEqual(choose(3), 'two');
    strictEqual(choose(4), 'one');
    strictEqual(choose(5), 'two');
  });
});
