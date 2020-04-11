const {
  over,
  values,
  set,
  isFunction,
  isUndefined,
  nth,
  toString,
  isArray,
  constant,
  flow,
  find,
  eq,
  pickBy,
  result,
  spread,
  defaultTo,
  isPlainObject,
  negate,
} = require('lodash/fp');

const ARG_PATTERN = /^\{(?:\$(\d+?))?(?:#(.+?))?\}$/;

/**
 * Transforms a plain object to a `choice` array.
 * Keys will be mapped to `when` and values to `then`.
 * Values can use the `ref` and `use` shorthand syntax like `'{$0}'` and `'{#one}'`,
 * which translates to `{ ref: '0' }` and `{ use: 'one' }` respectively.
 *
 * @example
 * const plain = {
 *   one: 1,
 *   two: 2,
 *   three: '$1',
 *   four: '#one',
 * };
 *
 * const transformed = transformChoiceObjectToArray(plain);
 * // =>
 * // [
 * //   { when: 'one', then: 1 },
 * //   { when: 'two', then: 2 },
 * //   { when: 'three', ref: '1' },
 * //   { when: 'four', use: 'one' },
 * // ]
 *
 * @param {Object.<string, any>} choices A plain object.
 */
const transformChoiceObjectToArray = (choices) =>
  Object.entries(choices).reduce((resultArray, [key, value]) => {
    const match = ARG_PATTERN.exec(value);

    const [ref, use] = over([nth(1), nth(2)])(match);

    const choice = {
      when: key,
      ref,
      use,
      then: value,
    };

    const filteredChoice = pickBy(negate(isUndefined), choice);

    return [...resultArray, filteredChoice];
  }, []);

/**
 * If the `choices` argument is a plain object, it is transformed into a `choice` array,
 * else it is returned as is.
 *
 * @param {Array<{ when: any, then?: any, ref?: number, use?: any, eager?: Function }> | Object.<string, any>} choices A `choice` array or a plain object.
 */
const normalizeChoices = (choices) =>
  isPlainObject(choices) ? transformChoiceObjectToArray(choices) : choices;

/**
 * If the `choices` argument is a function, it is called so as to extract
 * a plain object, or a `choice` array.
 *
 * @param {Array<{ when: any, then?: any, ref?: number, use?: any, eager?: Function }> | Object.<string, any> | (() => Array<{ when: any, then?: any, ref?: number, use?: any, eager?: Function }> | Object.<string, any>)} choices A `choice` array or a plain object, or a function that returns either.
 */
const getChoices = (choices) => (isFunction(choices) ? choices() : choices);

/**
 * Transforms the user's input to string when the choices is a plain object, or
 * returns it as is.
 *
 * @param {Array<{ when: any, then?: any, ref?: number, use?: any, eager?: Function }> | Object.<string, any>} choices A `choice` array or a plain object.
 * @param {any} input The user's input. Can be anything that will correspond to a `when` value.
 */
const normalizeInput = (choices, input) =>
  isPlainObject(choices) ? toString(input) : input;

/**
 * Normalizes the library's main args before passing them on.
 * 
 * @param {{input?: any, choices?: Array<{ when: any, then?: any, ref?: number, use?: any, eager?: Function }> | Object.<string, any>, equalityFn?: (input: any) => (when: any) => boolean}} args The library's main args supplied by the user, that will first be normalized. 
 */
const normalizeArgs = ({ input, choices, equalityFn }) =>
  flow(
    (args) => set('choices', getChoices(args.choices), args),
    (args) => set('input', normalizeInput(args.choices, args.input), args),
    (args) => set('choices', normalizeChoices(args.choices, args.input), args),
    values,
  )({ input, choices, equalityFn });

/**
 * Finds a `choice` entry from a `choice` array based on the user's input. It can recursively refer to itself with a
 * different index, if a `ref` is specified in the choice.
 *
 * @param {any} input The user's input. Can be anything that will correspond to a `when` value.
 * @param {Array<{ when: any, then?: any, ref?: number, use?: any, eager?: Function }> | Object.<string, any>} choices A `choice` array or a plain object.
 * @param {(input: any) => (when: any) => boolean} equalityFn Used to override the default equality function `eq` from `lodash`.
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
 * It will attempt to resolve it by finding the entry in the `choice` array whose `when` corresponds to the given
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
 * @param {Array<{ when: any, then?: any, ref?: number, use?: any, eager?: Function }> | Object.<string, any>} choices A `choice` array or a plain object.
 * @param {any} defaultValue A default value to be returned if the `input` does not yield a choice.
 * @param {(input: any) => (when: any) => boolean} equalityFn Used to override the default equality function `eq` from `lodash`.
 */
const chooser = (choices, defaultValue, equalityFn) =>
  function choose(input, equalityFnOverride) {
    return flow(
      spread(findChoiceFromArray),
      (choice) => !isUndefined(choice.eager) ? choice.eager : result('then', choice),
      defaultTo(defaultValue),
    )(normalizeArgs({ input, choices, equalityFn: equalityFnOverride || equalityFn }));
  };

module.exports = chooser;
