import { get } from '../object';

type WithRank<T> = T & { _rank: number };

/**
 * Rank an array of objects by a given path.
 *
 * @example
 * rankByPath([ { a: 1 }, { a: 3 }, { a: 1 } ], 'a') // => [ { _rank: 1, a: 1 }, { _rank: 1, a: 1 }, { _rank: 3, a: 3 } ]
 */
export const rankByPath = <T>(collection: T[], path: string): Array<WithRank<T>> => {
  let lastRank = 1;
  let lastNumber = 0;

  const items: Array<WithRank<T>> = [];
  for (const [index, item] of collection.sort((a, b) => get<number>(b, path) - get<number>(a, path)).entries()) {
    const n = Number(get(item, path));

    if (index === 0) {
      lastRank = 1;
      lastNumber = n;
    }

    if (lastNumber !== n) {
      lastNumber = n;
      lastRank = index + 1;
    }

    (item as WithRank<T>)._rank = lastRank;
    items.push(item as WithRank<T>);
  }

  return items;
};
