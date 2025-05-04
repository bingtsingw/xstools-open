/**
 * Returns the first element of an array.
 *
 * @template T - The type of elements in the array.
 * @param {[T, ...T[]]} arr - A non-empty array from which to get the first element.
 * @returns {T} The first element of the array.
 *
 * @example
 * head([1, 2, 3]) // => 1
 */
export function head<T>(arr: readonly [T, ...T[]]): T;

/**
 * Returns the first element of an array or `undefined` if the array is empty.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array from which to get the first element.
 * @returns {T | undefined} The first element of the array, or `undefined` if the array is empty.
 *
 * @example
 * head([]) // => undefined
 */
export function head<T>(arr: readonly T[]): T | undefined;

/**
 * Returns the first element of an array or `undefined` if the array is empty.
 *
 * Reference: https://es-toolkit.slash.page/reference/array/head.html
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array from which to get the first element.
 * @returns {T | undefined} The first element of the array, or `undefined` if the array is empty.
 *
 * @example
 * head([]) // => undefined
 */
export function head<T>(arr: readonly T[]): T | undefined {
  if (!arr || !Array.isArray(arr)) {
    return undefined;
  }

  return arr[0];
}
