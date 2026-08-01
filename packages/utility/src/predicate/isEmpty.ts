/**
 * Checks if a value is empty.
 *
 * Supports `null` / `undefined`, strings, arrays, `Map`, `Set`, and plain objects
 * (via `Object.keys`). Other primitives and functions are not empty.
 *
 * @example
 * isEmpty(null) // => true
 * isEmpty(undefined) // => true
 * isEmpty('') // => true
 * isEmpty([]) // => true
 * isEmpty({}) // => true
 * isEmpty(new Map()) // => true
 * isEmpty(new Map([['a', 1]])) // => false
 * isEmpty(0) // => false
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
};
