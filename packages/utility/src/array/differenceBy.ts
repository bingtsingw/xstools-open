/**
 * Computes the difference between two arrays after mapping their elements through a provided function.
 *
 * Non-array `a` yields `[]`. Non-array / nullish `b` yields `a` unchanged.
 *
 * Reference: https://es-toolkit.dev/reference/array/differenceBy.html
 *
 * @param a - The array to inspect.
 * @param b - The values to exclude.
 * @param mapper - Maps each element before comparison.
 * @returns A new array of filtered values.
 *
 * @example
 * differenceBy([{ id: 1 }, { id: 2 }, { id: 3 }], [{ id: 2 }, { id: 4 }], item => item.id); // => [{ id: 1 }, { id: 3 }]
 * differenceBy([{ id: 1 }, { id: 2 }, { id: 3 }], [2, 4], item => (typeof item === 'object' ? item.id : item)); // => [{ id: 1 }, { id: 3 }]
 */
export const differenceBy = <T, U>(a: readonly T[], b: readonly U[], mapper: (value: T | U) => unknown): T[] => {
  if (!a || !Array.isArray(a)) {
    return [];
  }

  if (!b || !Array.isArray(b)) {
    return a;
  }

  const mappedSecondSet = new Set(b.map((item) => mapper(item)));

  return a.filter((item) => {
    return !mappedSecondSet.has(mapper(item));
  });
};
