import { values, set, isFunction, isUndefined, toString, isArray, constant, flow, find, eq, pickBy, result, spread, defaultTo, isPlainObject, negate, curryN, } from 'lodash/fp';
var ARG_PATTERN = /^\{(?:\$(\d+?))?(?:#(.+?))?\}$/;
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
 *   three: '{$1}',
 *   four: '{#one}',
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
 * @param choices A plain object.
 */
var transformChoiceObjectToArray = function (choices) {
    return Object.entries(choices).map(function (_a) {
        var key = _a[0], value = _a[1];
        var match = ARG_PATTERN.exec(value);
        var _b = match || [], ref = _b[1], use = _b[2];
        var choice = {
            when: key,
            ref: ref,
            use: use,
            then: value,
        };
        return pickBy(negate(isUndefined), choice);
    }, []);
};
/**
 * If the `choices` argument is a plain object, it is transformed into a `choice` array,
 * else it is returned as is.
 *
 * @param choices A `choice` array or a plain object.
 */
var normalizeChoices = function (choices) {
    return isPlainObject(choices) ? transformChoiceObjectToArray(choices) : choices;
};
/**
 * If the `choices` argument is a function, it is called so as to extract
 * a plain object, or a `choice` array.
 *
 * @param choices A `choice` array or a plain object, or a function that returns either.
 */
var getChoices = function (choices) {
    return isFunction(choices) ? choices() : choices;
};
/**
 * Transforms the user's input to string when the choices is a plain object, or
 * returns it as is.
 *
 * @param choices A `choice` array or a plain object.
 * @param input The user's input. Can be anything that will correspond to a `when` value.
 */
var normalizeInput = function (choices, input) {
    return isPlainObject(choices) ? toString(input) : input;
};
/**
 * Curries the `equalityFn` specified by the user.
 *
 * @param equalityFn The equalityFn specified by the user.
 */
var normalizeEqualityFn = function (equalityFn) {
    return equalityFn && curryN(2, equalityFn);
};
/**
 * Normalizes the library's main args before passing them on.
 *
 * @param args The library's main args supplied by the user, that will first be normalized.
 */
var normalizeArgs = function (_a) {
    var input = _a.input, choices = _a.choices, equalityFn = _a.equalityFn;
    return flow(function (args) { return set('choices', getChoices(args.choices), args); }, function (args) { return set('input', normalizeInput(args.choices, args.input), args); }, function (args) { return set('choices', normalizeChoices(args.choices), args); }, function (args) { return set('equalityFn', normalizeEqualityFn(equalityFn), args); }, values)({ input: input, choices: choices, equalityFn: equalityFn });
};
/**
 * Finds a `choice` entry from a `choice` array based on the user's input. It can recursively refer to itself with a
 * different index, if a `ref` is specified in the choice.
 *
 * @param input The user's input. Can be anything that will correspond to a `when` value.
 * @param choices A `choice` array or a plain object.
 * @param equalityFn Used to override the default equality function `eq` from `lodash`.
 * @param index Used to recursively refer to a different choice entry by using a `ref`.
 */
var findChoiceFromArray = function (input, choices, equalityFn, index) {
    if (equalityFn === void 0) { equalityFn = eq; }
    return flow(!isUndefined(index)
        ? constant(choices[index])
        : find(function (_a) {
            var when = _a.when;
            return isArray(when) ? when.some(equalityFn(input)) : equalityFn(input)(when);
        }), defaultTo({}), function (selectedChoice) {
        return !isUndefined(selectedChoice.ref)
            ? findChoiceFromArray(input, choices, equalityFn, selectedChoice.ref)
            : !isUndefined(selectedChoice.use)
                ? findChoiceFromArray(selectedChoice.use, choices, equalityFn)
                : selectedChoice;
    })(choices);
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
 * @param choices A `choice` array or a plain object.
 * @param defaultValue A default value to be returned if the `input` does not yield a choice.
 * @param equalityFn Used to override the default equality function `eq` from `lodash`.
 */
var chooser = function (choices, defaultValue, equalityFn) {
    return function choose(input, equalityFnOverride) {
        return flow(spread(findChoiceFromArray), function (choice) {
            return !isUndefined(choice.eager) ? choice.eager : result('then', choice);
        }, defaultTo(defaultValue))(normalizeArgs({
            input: input,
            choices: choices,
            equalityFn: equalityFnOverride || equalityFn,
        }));
    };
};
export default chooser;
