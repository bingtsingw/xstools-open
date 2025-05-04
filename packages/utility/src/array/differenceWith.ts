/**
 * Computes the difference between two arrays based on a custom equality function.
 *
 * Reference: https://es-toolkit.slash.page/reference/array/differenceWith.html
 *
 * @example
 * differenceWith([{ id: 1 }, { id: 2 }, { id: 3 }], [{ id: 2 }, { id: 4 }], (a, b) => a.id === b.id); // => [{ id: 1 }, { id: 3 }]
 * differenceWith([{ id: 1 }, { id: 2 }, { id: 3 }], [2, 4], (a, b) => (typeof a === 'object' ? a.id : a) === (typeof b === 'object' ? b.id : b)); // => [{ id: 1 }, { id: 3 }]
 */
export function differenceWith<T, U>(a: readonly T[], b: readonly U[], areItemsEqual: (x: T, y: U) => boolean): T[] {
  if (!b || !Array.isArray(b)) {
    return a as T[];
  }

  if (!a || !Array.isArray(a)) {
    return [];
  }

  return a.filter((firstItem) => {
    return b.every((secondItem) => {
      return !areItemsEqual(firstItem, secondItem);
    });
  });
}
