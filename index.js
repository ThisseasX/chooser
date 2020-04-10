const {
  isUndefined,
  nth,
  toString,
  isArray,
  constant,
  flow,
  find,
  eq,
  pick,
  pickBy,
  result,
  spread,
  includes,
  defaultTo,
  omit,
  isPlainObject,
  negate,
} = require('lodash/fp');

const KNOWN_KEYS = ['ref', 'use', 'when', 'then', 'eager'];
const REF_PATTERN = /^\$(\d+)$/;

/**
 * Transforms a plain object to a choice array.
 * Keys will be mapped to `when` and values to `then`.
 * Values can be choice objects with `then`, `ref`, `use`, excluding `when`.
 * Values can also use the `ref` shorthand syntax like `'$0'`, `'$1'`, which is
 * a string with an index to use as a ref, prefixed by a `'$'`.
 *
 * @example
 * const plain = {
 *   one: 1,
 *   two: 2,
 * };
 *
 * const transformed = transformChoiceObjectToArray(plain);
 * // =>
 * // [
 * //   { when: 'one', then: 1 },
 * //   { when: 'two', then: 2 },
 * // ]
 *
 * @param {Object.<string, { then?: any, ref?: number, use?: any, eager?: Function }>} choices A plain object.
 */
const transformChoiceObjectToArray = (choices) =>
  Object.entries(choices).reduce((resultArray, [key, value]) => {
    const { ref, use, then, eager } = pick(KNOWN_KEYS, value);
    const match = REF_PATTERN.exec(then) || REF_PATTERN.exec(value);

    const choice = {
      when: key,
      ref: !isUndefined(ref) ? ref : nth(1, match),
      use: !isUndefined(use) ? toString(use) : undefined,
      then: !isUndefined(then) ? then : isPlainObject(value) ? omit(KNOWN_KEYS, value) : value,
      eager,
    };

    const filteredChoice = pickBy(negate(isUndefined), choice);

    return [...resultArray, filteredChoice];
  }, []);

/**
 * Normalizes a choice array to make each choice consistent with the choice schema.
 * If an entry of the choice array is a plain object, it is transformed to a choice object,
 * mapping its key to `when` and its value to `then`.
 *
 * @param {Array<{ when: any, then?: any, ref?: number, use?: any, eager?: Function }> | Array<Object.<string, any>>} choices A choice array.
 */
const normalizeChoiceArray = (choices) =>
  choices.map((choice) =>
    Object.entries(choice).reduce(
      (resultObj, [key, value]) =>
        !includes(key, KNOWN_KEYS)
          ? { ...resultObj, when: key, then: value }
          : { ...resultObj, [key]: value },
      {},
    ),
  );

/**
 * Wraps the above two functions, transforming a plain object to a choice array, and then normalizes it.
 *
 * @param {Array<{ when: any, then?: any, ref?: number, use?: any, eager?: Function }> | Array<Object.<string, any>> | Object.<string, any>} choices A choice array or a plain object.
 */
const normalizeChoices = (choices) =>
  flow(
    (choices) =>
      isPlainObject(choices) ? transformChoiceObjectToArray(choices) : choices,
    normalizeChoiceArray,
  )(choices);

/**
 * Transforms the user's input to string when the choices is a plain object, or
 * returns it as is.
 *
 * @param {Array<{ when: any, then?: any, ref?: number, use?: any, eager?: Function }> | Array<Object.<string, any>> | Object.<string, any>} choices A choice array or a plain object.
 * @param {any} input The user's input. Can be anything that will correspond to a `when` value.
 */
const normalizeInput = (choices, input) =>
  isPlainObject(choices) ? toString(input) : input;

/**
 * Finds a choice entry from a choice array based on the user's input. It can recursively refer to itself with a
 * different index, if a `ref` is specified in the choice.
 *
 * @param {any} input The user's input. Can be anything that will correspond to a `when` value.
 * @param {Array<{ when: any, then?: any, ref?: number, use?: any, eager?: Function }> | Array<Object.<string, any>> | Object.<string, any>} choices A choice array or a plain object.
 * @param {(a: any) => (b: any) => boolean} equalityFn Used to override the default equality function `eq` from `lodash`.
 * @param {number} index Used to recursively refer to a different choice entry by using a `ref`.
 */
const findChoiceFromArray = (input, choices, equalityFn = eq, index) => {
  return flow(
    !isUndefined(index)
      ? constant(choices[index])
      : find(({ when }) =>
          isArray(when) ? when.some(equalityFn(input)) : equalityFn(input)(when),
        ),
    defaultTo({}),
    (selectedChoice) =>
      !isUndefined(selectedChoice.ref)
        ? findChoiceFromArray(input, choices, equalityFn, selectedChoice.ref)
        : !isUndefined(selectedChoice.use)
        ? findChoiceFromArray(selectedChoice.use, choices, equalityFn)
        : selectedChoice,
  )(choices);
};

/**
 * The heart of this library, a curried function which stores the specified choices (and extra options) in the first call,
 * and returns a function that will take the user's input, find the corresponding choice, and return its `then` value.
 *
 * It will attempt to resolve it by finding the entry in the choice array whose `when` corresponds to the given
 * `input`. If a `ref` exists in that entry, it will instead find its referenced entry. IF `use` exists in that entry,
 * it will instead try to find an entry that corresponds to the given `use` instead of `when`.
 *
 * The matching between the `input` and the `when` is performed by running the `equalityFn` with the `input` against the value of `when`,
 * or against each element in `when` if it is an array.
 *
 * After all recursive calls have returned and a choice has been found, the `then` of the choice is returned.
 * If the `then` is a function, it is called and its result is returned instead, to leverage lazy evaluation.
 *
 * As an escape hatch for the above lazy evaluation mechanism, a function can be specified under the `eager` key,
 * and it will be returned as is, without it being executed to extract its result.
 *
 * @param {Array<{ when: any, then?: any, ref?: number, use?: any, eager?: Function }> | Array<Object.<string, any>> | Object.<string, any>} choices A choice array or a plain object.
 * @param {any} defaultValue A default value to be returned if the `input` does not yield a choice.
 * @param {(a: any) => (b: any) => boolean} equalityFn Used to override the default equality function `eq` from `lodash`.
 */
const chooser = (choices, defaultValue, equalityFn) =>
  function choose(input) {
    return flow(
      spread(findChoiceFromArray),
      (choice) => (!isUndefined(choice.eager) ? choice.eager : result('then', choice)),
      defaultTo(defaultValue),
    )([normalizeInput(choices, input), normalizeChoices(choices), equalityFn]);
  };

module.exports = chooser;
