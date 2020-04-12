const testFn = () => 123;
const testObj = { nested: { value: 2 } };
const testEqualityFn = (input, when) => input.nested.value == when;

const choices1 = [
  { when: 0, then: [1, 2, 3] },
  { when: [1, 4], then: () => [4, 5, 6] },
  { when: 2, then: () => [7, 8, 9] },
  { when: 3, ref: 1 },
  { when: 5, ref: 3 },
  { when: 6, use: 1 },
  { when: 7, then: testFn },
  { when: 8, eager: testFn },
  { when: 9, ref: 0 },
  { when: 10, use: 0 },
];

const choices2 = {
  0: [7, 8, 9],
  1: [1, 2, 3],
  2: () => [4, 5, 6],
  3: '{$0}',
  4: '{#2}',
  5: testFn,
};

const testCases = [
  {
    choices: choices1,
    input: 0,
    expected: [1, 2, 3],
  },
  {
    choices: choices1,
    input: 1,
    expected: [4, 5, 6],
  },
  {
    choices: choices1,
    input: 2,
    expected: [7, 8, 9],
  },
  {
    choices: choices1,
    input: 3,
    expected: [4, 5, 6],
  },
  {
    choices: choices1,
    input: 4,
    expected: [4, 5, 6],
  },
  {
    choices: choices1,
    input: 5,
    expected: [4, 5, 6],
  },
  {
    choices: choices1,
    input: 6,
    expected: [4, 5, 6],
  },
  {
    choices: choices1,
    input: 7,
    expected: 123,
  },
  {
    choices: choices1,
    input: 8,
    expected: testFn,
  },
  {
    choices: choices1,
    input: 9,
    expected: [1, 2, 3],
  },
  {
    choices: choices1,
    input: 10,
    expected: [1, 2, 3],
  },
  {
    choices: choices1,
    input: testObj,
    expected: [7, 8, 9],
    equalityFn: testEqualityFn,
  },
  {
    choices: choices1,
    input: 100,
    defaultValue: [10, 11, 12],
    expected: [10, 11, 12],
  },
  {
    choices: choices1,
    input: 14,
    expected: undefined,
  },
  {
    choices: choices2,
    input: 1,
    expected: [1, 2, 3],
  },
  {
    choices: choices2,
    input: 2,
    expected: [4, 5, 6],
  },
  {
    choices: choices2,
    input: 3,
    expected: [7, 8, 9],
  },
  {
    choices: choices2,
    input: 4,
    expected: [4, 5, 6],
  },
  {
    choices: choices2,
    input: 5,
    expected: 123,
  },
  {
    choices: choices2,
    input: testObj,
    expected: [4, 5, 6],
    equalityFn: testEqualityFn,
  },
];

export default testCases;
