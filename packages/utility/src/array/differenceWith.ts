/**
 * Computes the difference between two arrays based on a custom equality function.
 *
 * Non-array `a` yields `[]`. Non-array / nullish `b` yields `a` unchanged.
 *
 * Reference: https://es-toolkit.dev/reference/array/differenceWith.html
 *
 * @param a - The array to inspect.
 * @param b - The values to exclude.
 * @param areItemsEqual - Invoked to compare elements of `a` and `b`.
 * @returns A new array of filtered values.
 *
 * @example
 * differenceWith([{ id: 1 }, { id: 2 }, { id: 3 }], [{ id: 2 }, { id: 4 }], (a, b) => a.id === b.id); // => [{ id: 1 }, { id: 3 }]
 * differenceWith([{ id: 1 }, { id: 2 }, { id: 3 }], [2, 4], (a, b) => (typeof a === 'object' ? a.id : a) === (typeof b === 'object' ? b.id : b)); // => [{ id: 1 }, { id: 3 }]
 */
export const differenceWith = <T, U>(a: readonly T[], b: readonly U[], areItemsEqual: (x: T, y: U) => boolean): T[] => {
  if (!a || !Array.isArray(a)) {
    return [];
  }

  if (!b || !Array.isArray(b)) {
    return a;
  }

  return a.filter((firstItem) => {
    return b.every((secondItem) => {
      return !areItemsEqual(firstItem, secondItem);
    });
  });
};
