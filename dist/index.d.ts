declare type Choice = {
    when: any;
    then?: any;
    ref?: number;
    use?: any;
    eager?: Function;
};
declare type PlainObject = {
    [x: string]: any;
};
declare type Choices = Choice[] | PlainObject;
declare type LazyChoices = () => Choices;
declare type EqualityFn = (input: any, when: any) => boolean;
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
declare const chooser: (choices: PlainObject | Choice[] | LazyChoices, defaultValue?: any, equalityFn?: EqualityFn | undefined) => (input: any, equalityFnOverride?: EqualityFn | undefined) => any;
export default chooser;
