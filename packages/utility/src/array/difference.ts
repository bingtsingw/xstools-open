/**
 * Computes the difference between two arrays.
 *
 * Reference: https://es-toolkit.slash.page/reference/array/difference.html
 *
 * @example
 * difference([1, 2, 3, 4, 5], [2, 4]); // => [1, 3, 5]
 */
export const difference = <T>(a: readonly T[], b: readonly T[]): T[] => {
  if (!b || !Array.isArray(b)) {
    return a as T[];
  }

  if (!a || !Array.isArray(a)) {
    return [];
  }

  const set = new Set(b);

  return a.filter((item) => !set.has(item));
};
