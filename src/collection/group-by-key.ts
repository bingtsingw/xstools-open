import { get } from 'lodash';

export const groupByKey = <T>(datas: T[], key: keyof T, formatter?: (v: string) => string): Record<string, T[]> => {
  const ret: Record<string, T[]> = {};

  if (datas && Array.isArray(datas)) {
    for (const data of datas) {
      let value = get(data, key);
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
