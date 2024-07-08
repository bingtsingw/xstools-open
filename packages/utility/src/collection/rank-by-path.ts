import { get, sort } from '@xstools/radash';

type WithRank<T> = T & { _rank: number };

export const rankByPath = <T>(collection: T[], path: string): Array<WithRank<T>> => {
  let lastRank = 1;
  let lastNumber = 0;
  const items: Array<WithRank<T>> = [];
  for (const [index, item] of sort(collection, (c) => get(c, path), true).entries()) {
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
