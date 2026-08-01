/**
 * Checks if a value is empty.
 *
 * Guaranteed cases: `null` / `undefined`, strings, arrays, `Map`, `Set`, and
 * plain objects (via `Object.keys`). Other values follow the implementation:
 * - primitives and functions → not empty
 * - `Date` / class instances → empty if they have no own enumerable keys
 *   (`Date` is typically empty)
 * - `arguments` → empty if `Object.keys` length is `0`
 *
 * Reference: https://es-toolkit.dev/compat/reference/predicate/isEmpty.html
 *
 * @param value - The value to check.
 * @returns `true` if `value` is empty.
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
