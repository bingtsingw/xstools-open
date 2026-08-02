import { UTCDateMini } from './UTCDateMini';

/**
 * Creates a `UTCDateMini` from the given value for date-fns `{ in }` context.
 *
 * @param value - Date value, timestamp, string or `Date` instance
 * @returns UTCDateMini instance
 *
 * @example
 * import { isSameDay } from 'date-fns';
 * import { utc } from '@xstools/utility/date-fns';
 *
 * isSameDay('2024-09-09T23:00:00-04:00', '2024-09-10T10:00:00+08:00', { in: utc });
 * // => true
 *
 * @see https://github.com/date-fns/date-fns/tree/main/pkgs/utc
 */
export const utc = (value: Date | number | string) => new UTCDateMini(Number(new Date(value)));
