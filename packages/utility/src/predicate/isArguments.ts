import { getTag } from '../object';

/**
 * Checks if the given value is an arguments object.
 *
 * Reference: https://es-toolkit.dev/compat/reference/predicate/isArguments.html
 *
 * @param value - The value to check.
 * @returns `true` if `value` is an arguments object.
 *
 * @example
 * const args = (function() { return arguments; })();
 * const strictArgs = (function() { 'use strict'; return arguments; })();
 * const value = [1, 2, 3];
 *
 * isArguments(args); // => true
 * isArguments(strictArgs); // => true
 * isArguments(value); // => false
 */
export const isArguments = (value: unknown): value is IArguments => {
  return value !== null && typeof value === 'object' && getTag(value) === '[object Arguments]';
};
