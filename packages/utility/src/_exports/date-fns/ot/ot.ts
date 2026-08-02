import { parseOffset, toEpoch } from '../../../date';
import { OTDateMini } from './OTDateMini';

/**
 * Build a fixed-offset date factory for date-fns `{ in }` context.
 *
 * @param offset - Fixed UTC offset (`+08:00`, `-0530`, …)
 * @returns `(value) => OTDateMini` in that offset
 *
 * @example
 * import { startOfDay } from 'date-fns';
 * import { ot } from '@xstools/utility/date-fns';
 *
 * startOfDay('2000-01-01T15:59:00.000Z', { in: ot('+08:00') }).toISOString();
 * // => '1999-12-31T16:00:00.000Z'
 *
 * @throws {ParamError} When `offset` is invalid, or later when `value` is not a finite instant / strict ISO string
 */
export const ot = (offset: string) => {
  parseOffset(offset);
  return (value: Date | number | string) => OTDateMini.ot(offset, toEpoch(value));
};
