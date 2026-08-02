import { TZDateMini } from '@date-fns/tz';

/**
 * Build a timezone-bound date factory for date-fns `in` context.
 *
 * @param timeZone - IANA time zone id (e.g. `'Asia/Shanghai'`).
 * @returns `(value) => TZDateMini` in that zone.
 */
export const tz = (timeZone: string) => (value: Date | number | string) =>
  TZDateMini.tz(timeZone, Number(new Date(value)));
