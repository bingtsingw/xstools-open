/**
 * Gets the `toStringTag` of `value`.
 *
 * Explicit branches for `null` / `undefined` keep tags stable on older engines
 * that may not distinguish them via `Object.prototype.toString`.
 *
 * @param value - The value to inspect.
 * @returns A tag string such as `'[object Object]'`.
 *
 * @example
 * getTag(null); // => '[object Null]'
 * getTag(undefined); // => '[object Undefined]'
 * getTag({}); // => '[object Object]'
 * getTag(1); // => '[object Number]'
 * getTag(Symbol('')); // => '[object Symbol]'
 * getTag(new Map()); // => '[object Map]'
 * getTag(new Set()); // => '[object Set]'
 */
export const getTag = <T>(value: T): string => {
  if (value === null) {
    return '[object Null]';
  }

  if (value === undefined) {
    return '[object Undefined]';
  }

  return Object.prototype.toString.call(value);
};
