const { curryN } = require('lodash/fp');

const callTimes = curryN(3, (fn, times, ...args) =>
  Array(times)
    .fill()
    .forEach(() => fn(...args)),
);

module.exports = {
  callTimes,
};
