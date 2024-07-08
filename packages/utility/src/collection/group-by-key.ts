import { get } from '@xstools/radash';

type Key<T> = {
  [K in keyof T]: K extends string ? (T[K] extends string ? K : never) : never;
}[keyof T];

export const groupByKey = <T>(datas: T[], key: Key<T>, formatter?: (v: string) => string): Record<string, T[]> => {
  const ret: Record<string, T[]> = {};

  if (datas && Array.isArray(datas)) {
    for (const data of datas) {
      let value = get<string>(data, key);
      value = formatter ? formatter(value) : value;
      if (ret[value]) {
        ret[value]!.push(data);
      } else {
        ret[value] = [data];
      }
    }
  }

  return ret;
};
