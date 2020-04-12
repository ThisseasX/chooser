import { chooser } from '../../src';

const equalityFnPerson = (input, when) => input.person.age == when;
const equalityFnDog = (input, when) => input.dog.age == when;

const choose = chooser([
  { when: 28, then: 'I am 28 years old!' },
  { when: 2, then: 'Woof woof!' },
]);

const data = {
  person: { age: 28 },
  dog: { age: 2 },
};

choose(data, equalityFnPerson); // => 'I am 28 years old!'
choose(data, equalityFnDog); // => 'Woof woof!'

///////////////////////////////////////////////////////////////////////////////
import { strictEqual } from 'assert';

describe('equality override demo', () => {
  test('is accurate', () => {
    strictEqual(choose(data, equalityFnPerson), 'I am 28 years old!');
    strictEqual(choose(data, equalityFnDog), 'Woof woof!');
  });
});
