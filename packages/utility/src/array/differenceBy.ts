/**
 * Computes the difference between two arrays after mapping their elements through a provided function.
 *
 * Reference: https://es-toolkit.slash.page/reference/array/differenceBy.html
 *
 * @example
 * differenceBy([{ id: 1 }, { id: 2 }, { id: 3 }], [{ id: 2 }, { id: 4 }], item => item.id); // => [{ id: 1 }, { id: 3 }]
 * differenceBy([{ id: 1 }, { id: 2 }, { id: 3 }], [2, 4], item => (typeof item === 'object' ? item.id : item)); // => [{ id: 1 }, { id: 3 }]
 */
export function differenceBy<T, U>(a: readonly T[], b: readonly U[], mapper: (value: T | U) => unknown): T[] {
  if (!b || !Array.isArray(b)) {
    return a as T[];
  }

  if (!a || !Array.isArray(a)) {
    return [];
  }

  const mappedSecondSet = new Set(b.map((item) => mapper(item)));

  return a.filter((item) => {
    return !mappedSecondSet.has(mapper(item));
  });
}
