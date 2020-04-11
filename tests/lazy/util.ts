import { curryN } from 'lodash/fp';

const callTimes = curryN<Function, number, number, void>(3, (fn, times, ...args) =>
  Array(times)
    .fill(undefined)
    .forEach(() => fn(...args)),
);

export { callTimes };
