import { chooser } from '../../src';

const choose = chooser(
  [
    { when: 1, then: 'one' },
    { when: 2, then: 'two' },
  ],
  'default string',
);

choose(100); // => 'default string'

///////////////////////////////////////////////////////////////////////////////
import { strictEqual } from 'assert';

describe('default value demo', () => {
  test('is accurate', () => {
    strictEqual(choose(100), 'default string');
  });
});
