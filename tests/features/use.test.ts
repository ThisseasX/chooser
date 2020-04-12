import chooser from '../../src';

const choose = chooser({
  1: 'one',
  2: 'two',
  3: '{#2}',
});

choose(1); // => 'one'
choose(2); // => 'two'
choose(3); // => 'two'

///////////////////////////////////////////////////////////////////////////////
import { strictEqual } from 'assert';

describe('use demo', () => {
  test('is accurate', () => {
    strictEqual(choose(1), 'one');
    strictEqual(choose(2), 'two');
    strictEqual(choose(3), 'two');
  });
});
