import { get } from 'lodash';

export const groupByDate = <T>(datas: T[], key: keyof T, formatter: (date: string) => string): Record<string, T[]> => {
  const ret: Record<string, T[]> = {};

  if (datas && Array.isArray(datas)) {
    for (const data of datas) {
      const date = formatter(get(data, key));
      if (ret[date]) {
        ret[date]!.push(data);
      } else {
        ret[date] = [data];
      }
    }
  }

  return ret;
};
