import { difference } from './difference';

/**
 * Computes the symmetric difference between two arrays: elements in either
 * array but not in both.
 *
 * Reference: https://es-toolkit.dev/reference/array/xor.html
 *
 * @example
 * xor([1, 2, 3, 4], [3, 4, 5, 6]) // => [1, 2, 5, 6]
 * xor(['a', 'b'], ['b', 'c']) // => ['a', 'c']
 * xor([1, 2], [1, 2]) // => []
 */
export const xor = <T>(a: readonly T[], b: readonly T[]): T[] => {
  const left = Array.isArray(a) ? a : [];
  const right = Array.isArray(b) ? b : [];

  return [...difference(left, right), ...difference(right, left)];
};
