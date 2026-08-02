import { get } from '../object';

/**
 * Rank an array of objects by a numeric path (competition ranking, descending).
 *
 * Tied values share a rank; the next distinct value skips ahead (`1, 1, 3, …`).
 * Does not mutate the input. Nullish / non-array `collection` yields `[]`.
 *
 * @param collection - The objects to rank.
 * @param path - Path resolved via `get` (e.g. `'exam.score'`).
 * @param rankKey - Property name written onto each result. Default: `'_rank'`.
 * @returns A new array sorted by the path value, each item with `rankKey` set.
 *
 * @example
 * rankByPath([{ a: 1 }, { a: 3 }, { a: 1 }], 'a')
 * // => [{ a: 3, _rank: 1 }, { a: 1, _rank: 2 }, { a: 1, _rank: 2 }]
 *
 * rankByPath([{ a: 3 }, { a: 1 }], 'a', 'rank')
 * // => [{ a: 3, rank: 1 }, { a: 1, rank: 2 }]
 */
export const rankByPath = <T, K extends string = '_rank'>(
  collection: readonly T[],
  path: string,
  rankKey: K = '_rank' as K,
): Array<T & Record<K, number>> => {
  if (!Array.isArray(collection) || collection.length === 0) {
    return [];
  }

  let lastRank = 1;
  let lastNumber = 0;

  const sorted = [...collection].sort((a, b) => get<number>(b, path) - get<number>(a, path));
  const items: Array<T & Record<K, number>> = [];

  for (const [index, item] of sorted.entries()) {
    const n = Number(get(item, path));

    if (index === 0) {
      lastRank = 1;
      lastNumber = n;
    }

    if (lastNumber !== n) {
      lastNumber = n;
      lastRank = index + 1;
    }

    items.push({ ...item, [rankKey]: lastRank } as T & Record<K, number>);
  }

  return items;
};
