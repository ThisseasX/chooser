import chooser from '../../src';

const choose = chooser({
  1: 'one',
  2: 'two',
});

choose(1); // => 'one'
choose('1'); // => 'one'
choose(2); // => 'two'
choose('2'); // => 'two'

///////////////////////////////////////////////////////////////////////////////
import { strictEqual } from 'assert';

describe('plain object demo', () => {
  test('is accurate', () => {
    strictEqual(choose(1), 'one');
    strictEqual(choose('1'), 'one');
    strictEqual(choose(2), 'two');
    strictEqual(choose('2'), 'two');
  });
});
