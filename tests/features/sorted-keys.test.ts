import chooser from '../../src';

const choose = chooser({
  2: 'two',
  1: 'one',
  3: '{$0}',
});

choose(3); // => 'one' instead of the usually expected 'two'

///////////////////////////////////////////////////////////////////////////////
import { strictEqual } from 'assert';

describe('sorted keys demo', () => {
  test('is accurate', () => {
    strictEqual(choose(1), 'one');
    strictEqual(choose(2), 'two');
    strictEqual(choose(3), 'one');
  });
});
