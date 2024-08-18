/**
 * Returns a random element from an array.
 *
 * @example
 * sample([1, 2, 3, 4, 5, 6]) // => random element
 * sample([]) // => undefined
 * sample() // => undefined
 */
export const sample = <T>(arr: T[]): T | undefined => {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  return undefined;
};
