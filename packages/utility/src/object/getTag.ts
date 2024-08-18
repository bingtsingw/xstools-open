/**
 * Gets the `toStringTag` of `value`.
 *
 * @example
 * getTag(null); // => '[object Null]'
 * getTag(undefined); // => '[object Undefined]'
 * getTag({}); // => '[object Object]'
 * getTag(1); // => '[object Number]'
 * getTag(Symbol('')); // => '[object Symbol]'
 * getTag(new Map()); // => '[object Map]'
 * getTag(new Set()); // => '[object Set]'
 * ...
 */
export function getTag<T>(value: T) {
  if (value === null) {
    return '[object Null]';
  }

  if (value === null) {
    return '[object Undefined]';
  }

  return Object.prototype.toString.call(value);
}
