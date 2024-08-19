/**
 * Checks if the given value is object-like.
 *
 * A value is object-like if its type is object and it is not null.
 *
 * @example
 * isObjectLike({ a: 1 }); // => true
 * isObjectLike([1, 2, 3]); // => true
 * isObjectLike('abc'); // => false
 * isObjectLike(() => {}); // => false
 * isObjectLike(null); // => false
 */

export function isObjectLike(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}
