/**
 * Computes the difference between two arrays.
 *
 * Non-array `a` yields `[]`. Non-array / nullish `b` yields `a` unchanged.
 *
 * Reference: https://es-toolkit.dev/reference/array/difference.html
 *
 * @param a - The array to inspect.
 * @param b - The values to exclude.
 * @returns A new array of filtered values.
 *
 * @example
 * difference([1, 2, 3, 4, 5], [2, 4]); // => [1, 3, 5]
 */
export const difference = <T>(a: readonly T[], b: readonly T[]): T[] => {
  if (!a || !Array.isArray(a)) {
    return [];
  }

  if (!b || !Array.isArray(b)) {
    return a;
  }

  const set = new Set(b);

  return a.filter((item) => !set.has(item));
};
