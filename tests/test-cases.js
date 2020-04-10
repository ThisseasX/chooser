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
  { when: 11, ref: 0 },
  { when: 12, use: 0 },
  { when: 0, then: [7, 8, 9] },
];

const choices2 = {
  0: [7, 8, 9],
  1: [1, 2, 3],
  2: () => [4, 5, 6],
  3: '$0',
  4: '$2',
  5: { ref: 3 },
  6: { use: 5 },
  7: testFn,
  8: { eager: testFn },
  9: { ref: 0 },
  10: { use: 0 },
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
    expected: [1, 2, 3],
  },
  {
    choices: choices1,
    input: 12,
    expected: [7, 8, 9],
  },
  {
    choices: choices1,
    input: 100,
    defaultValue: [10, 11, 12],
    expected: [10, 11, 12],
  },
  {
    choices: choices1,
    input: 0,
    expected: [7, 8, 9],
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
    expected: [7, 8, 9],
  },
  {
    choices: choices2,
    input: 6,
    expected: [7, 8, 9],
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
  {
    choices: choices2,
    input: 9,
    expected: [7, 8, 9],
  },
  {
    choices: choices2,
    input: 10,
    expected: [7, 8, 9],
  },
];

module.exports = testCases;
