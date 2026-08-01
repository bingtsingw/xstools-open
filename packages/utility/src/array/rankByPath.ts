import { get } from '../object';

type WithRank<T> = T & { _rank: number };

/**
 * Rank an array of objects by a given path.
 *
 * @example
 * rankByPath([{ a: 1 }, { a: 3 }, { a: 1 }], 'a')
 * // => [{ a: 3, _rank: 1 }, { a: 1, _rank: 2 }, { a: 1, _rank: 2 }]
 */
export const rankByPath = <T>(collection: readonly T[], path: string): Array<WithRank<T>> => {
  if (!Array.isArray(collection) || collection.length === 0) {
    return [];
  }

  let lastRank = 1;
  let lastNumber = 0;

  const sorted = [...collection].sort((a, b) => get<number>(b, path) - get<number>(a, path));
  const items: Array<WithRank<T>> = [];

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

    items.push({ ...item, _rank: lastRank });
  }

  return items;
};
