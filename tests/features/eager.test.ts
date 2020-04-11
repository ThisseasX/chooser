import chooser from '../../src';

const fn = () => 'one';

const choose = chooser([
  { when: 1, then: fn },
  { when: 2, eager: fn },
]);

choose(1); // => 'one'
choose(2); // => Function: fn

///////////////////////////////////////////////////////////////////////////////
import { strictEqual } from 'assert';

describe('eager demo', () => {
  test('is accurate', () => {
    strictEqual(choose(1), 'one');
    strictEqual(choose(2), fn);
  });
});
