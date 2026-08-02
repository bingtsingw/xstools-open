import { toEpoch } from '../../../date';
import { UTCDateMini } from './UTCDateMini';

/**
 * Creates a `UTCDateMini` from the given value for date-fns `{ in }` context.
 *
 * @param value - Timestamp, `Date`, or strict ISO instant string
 * @returns UTCDateMini instance
 *
 * @example
 * import { isSameDay } from 'date-fns';
 * import { utc } from '@xstools/utility/date-fns';
 *
 * isSameDay('2024-09-09T23:00:00-04:00', '2024-09-10T10:00:00+08:00', { in: utc });
 * // => true
 *
 * @throws {ParamError} When `value` is not a finite instant / strict ISO string
 *
 * @see https://github.com/date-fns/date-fns/tree/main/pkgs/utc
 */
export const utc = (value: Date | number | string) => new UTCDateMini(toEpoch(value));
