/**
 * Returns a random element from an array.
 *
 * Non-array or empty input yields `undefined`.
 *
 * @param arr - The array to sample from.
 * @returns A randomly selected element, or `undefined`.
 *
 * @example
 * sample([1, 2, 3, 4, 5, 6]) // => random element
 * sample([]) // => undefined
 */
export const sample = <T>(arr: readonly T[]): T | undefined => {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  return undefined;
};
