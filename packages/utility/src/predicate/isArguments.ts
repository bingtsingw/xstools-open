import { getTag } from '../object';

/**
 * Checks if the given value is an arguments object.
 *
 * @example
 * const args = (function() { return arguments; })();
 * const strictArgs = (function() { 'use strict'; return arguments; })();
 * const value = [1, 2, 3];
 *
 * console.log(isArguments(args)); // => true
 * console.log(isArguments(strictArgs)); // => true
 * console.log(isArguments(value)); // => false
 */
export function isArguments(value?: unknown): value is IArguments {
  return value !== null && typeof value === 'object' && getTag(value) === '[object Arguments]';
}
