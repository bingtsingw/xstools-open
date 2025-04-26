import { TZDateMini } from '@date-fns/tz';

export const tz = (timeZone: string) => (value: Date | number | string) =>
  TZDateMini.tz(timeZone, Number(new Date(value)));
