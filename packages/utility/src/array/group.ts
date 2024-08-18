/**
 * Groups the elements of an array based on a provided key-generating function.
 *
 * Reference: https://github.com/toss/es-toolkit/blob/main/src/array/groupBy.ts
 *
 * @example
 * groupBy([6.1, 4.2, 6.3], Math.floor) // => { 4: [4.2], 6: [6.1, 6.3] }
 * groupBy(['one', 'two', 'three'], (v) => v.length) // => { 3: ['one', 'two'], 5: ['three'] }
 * groupBy(
 *   [
 *     { score: 10, 'test-key': '2022-10-01 00:00:00' },
 *     { score: 20, 'test-key': '2022-10-02 00:00:00' },
 *     { score: 30, 'test-key': '2022-10-01 00:00:00' },
 *     { score: 40, 'test-key': '2022-10-03 00:00:00' },
 *     { score: 50, 'test-key': '2022-10-03 00:00:00' },
 *     { score: 60, 'test-key': '2022-10-03 00:00:00' },
 *   ],
 *   (data) => new Date(data['test-key']).toISOString().substring(0, 10),
 * )
 * // =>
 * // {
 * //   '2022-10-01': [
 * //     { score: 10, 'test-key': '2022-10-01 00:00:00' },
 * //     { score: 30, 'test-key': '2022-10-01 00:00:00' },
 * //   ],
 * //   '2022-10-02': [{ score: 20, 'test-key': '2022-10-02 00:00:00' }],
 * //   '2022-10-03': [
 * //     { score: 40, 'test-key': '2022-10-03 00:00:00' },
 * //     { score: 50, 'test-key': '2022-10-03 00:00:00' },
 * //     { score: 60, 'test-key': '2022-10-03 00:00:00' },
 * //   ],
 * // }
 */
export function groupBy<T, K extends PropertyKey>(arr: readonly T[], getKeyFromItem: (item: T) => K): Record<K, T[]> {
  const result = {} as Record<K, T[]>;

  if (Array.isArray(arr)) {
    for (const item of arr) {
      const key = getKeyFromItem(item);

      if (!result[key]) {
        result[key] = [];
      }

      result[key].push(item);
    }
  }

  return result;
}
