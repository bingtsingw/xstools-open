import { UTCDate } from './UTCDate';

/**
 * The function creates a new `UTCDate` instance from the provided value. Use it
 * to provide the context for the date-fns functions, via the `in` option.
 *
 * @param value - Date value, timestamp, string or `Date` instance
 *
 * @returns UTCDate instance created from the provided value
 *
 * @see https://github.com/date-fns/utc
 */
export const utc = (value: Date | number | string) => new UTCDate(Number(new Date(value)));
