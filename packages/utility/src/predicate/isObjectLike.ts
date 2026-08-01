/**
 * Checks if the given value is object-like.
 *
 * A value is object-like if its type is object and it is not null.
 *
 * Reference: https://es-toolkit.dev/compat/reference/predicate/isObjectLike.html
 *
 * @param value - The value to check.
 * @returns `true` if `value` is object-like.
 *
 * @example
 * isObjectLike({ a: 1 }); // => true
 * isObjectLike([1, 2, 3]); // => true
 * isObjectLike('abc'); // => false
 * isObjectLike(() => {}); // => false
 * isObjectLike(null); // => false
 */
export const isObjectLike = (value: unknown): value is object => {
  return typeof value === 'object' && value !== null;
};
