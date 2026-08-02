import type { Interval } from 'date-fns';
import { ParamError } from '../../../error';

/**
 * Whether two intervals overlap (inclusive endpoints).
 *
 * @throws {ParamError} When either interval has start after end
 *
 * @example
 * areIntervalsOverlap(
 *   { start: new Date('2023-01-01'), end: new Date('2023-12-30') },
 *   { start: new Date('2023-05-01'), end: new Date('2024-12-31') },
 * )
 * // => true
 */
export const areIntervalsOverlap = (intervalLeft: Interval, intervalRight: Interval): boolean => {
  if (intervalLeft.start > intervalLeft.end || intervalRight.start > intervalRight.end) {
    throw new ParamError('时间段无效');
  }

  if (intervalLeft.end < intervalRight.start || intervalRight.end < intervalLeft.start) {
    return false;
  }

  return true;
};

/**
 * Whether `time` overlaps any interval in `compares`.
 *
 * @throws {ParamError} When any compared interval is invalid (via `areIntervalsOverlap`)
 */
export const areIntervalsOverlaps = (time: Interval, compares: Interval[]): boolean => {
  for (const compare of compares) {
    if (areIntervalsOverlap(time, compare)) {
      return true;
    }
  }

  return false;
};
