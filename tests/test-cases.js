const testFn = () => 123;

const choices1 = [
  { when: [1, 4], then: () => [1, 2, 3] },
  { when: 2, then: () => [4, 5, 6] },
  { when: 3, ref: 1 },
  { when: 4, ref: 2 },
  { when: 5, ref: 3 },
  { when: 6, use: 1 },
  { 7: () => 1 },
  { 8: 2 },
  { when: 9, then: testFn },
  { when: 10, eager: testFn },
];

const choices2 = {
  1: [1, 2, 3],
  2: () => [4, 5, 6],
  3: '$0',
  4: '$2',
  5: { ref: 3 },
  6: { use: 5 },
  7: testFn,
  8: { eager: testFn },
};

const testCases = [
  {
    choices: choices1,
    input: 1,
    expected: [1, 2, 3],
  },
  {
    choices: choices1,
    input: 2,
    expected: [4, 5, 6],
  },
  {
    choices: choices1,
    input: 3,
    expected: [4, 5, 6],
  },
  {
    choices: choices1,
    input: 4,
    expected: [1, 2, 3],
  },
  {
    choices: choices1,
    input: 5,
    expected: [4, 5, 6],
  },
  {
    choices: choices1,
    input: 6,
    expected: [1, 2, 3],
  },
  {
    choices: choices1,
    input: 7,
    expected: 1,
    equalityFn: (a) => (b) => a == b,
  },
  {
    choices: choices1,
    input: 8,
    expected: 2,
    equalityFn: (a) => (b) => a == b,
  },
  {
    choices: choices1,
    input: 7,
    expected: undefined,
  },
  {
    choices: choices1,
    input: 8,
    expected: undefined,
  },
  {
    choices: choices1,
    input: 9,
    expected: 123,
  },
  {
    choices: choices1,
    input: 10,
    expected: testFn,
  },
  {
    choices: choices1,
    input: 11,
    defaultValue: [7, 8, 9],
    expected: [7, 8, 9],
  },
  {
    choices: choices1,
    input: 12,
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
    expected: [1, 2, 3],
  },
  {
    choices: choices2,
    input: 4,
    expected: [1, 2, 3],
  },
  {
    choices: choices2,
    input: 5,
    expected: [1, 2, 3],
  },
  {
    choices: choices2,
    input: 6,
    expected: [1, 2, 3],
  },
  {
    choices: choices2,
    input: 7,
    expected: 123,
  },
  {
    choices: choices2,
    input: 8,
    expected: testFn,
  },
];

module.exports = testCases;
