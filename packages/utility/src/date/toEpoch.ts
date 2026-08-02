import { ParamError } from '../error';

/** Instant ISO-8601 with mandatory timezone: `Z` or `±HH:MM` / `±HHMM`. */
const ISO_INSTANT_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(?:Z|[+-]\d{2}:?\d{2})$/;

/**
 * Parse a strict ISO instant string into epoch milliseconds.
 *
 * Requires `T` separator and an explicit timezone (`Z` or numeric offset).
 * Date-only / space-separated / timezone-less forms are rejected.
 *
 * @param value - ISO instant string
 * @returns Epoch milliseconds
 * @throws {ParamError} When the string is not a strict ISO instant
 *
 * @example
 * parseStrictISOString('2023-05-03T00:00:00.000Z') // => Date.UTC(2023, 4, 3)
 * parseStrictISOString('2020-01-01T08:00:00+08:00') // => Date.UTC(2020, 0, 1)
 */
export const parseStrictISOString = (value: string): number => {
  if (typeof value !== 'string' || !ISO_INSTANT_RE.test(value)) {
    throw new ParamError('Invalid ISO date string');
  }

  const time = Date.parse(value);
  if (!Number.isFinite(time)) {
    throw new ParamError('Invalid ISO date string');
  }

  return time;
};

/**
 * Convert `string | number | Date` to a finite epoch millisecond value.
 *
 * @throws {ParamError} When value is not a finite timestamp / Date / strict ISO string
 *
 * @example
 * toEpoch('2020-01-01T00:00:00.000Z') // => Date.UTC(2020, 0, 1)
 * toEpoch(Date.UTC(2020, 0, 1)) // => Date.UTC(2020, 0, 1)
 */
export const toEpoch = (value: string | number | Date): number => {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new ParamError('Invalid date value');
    }
    return value;
  }

  if (value instanceof Date) {
    const time = Number(value);
    if (!Number.isFinite(time)) {
      throw new ParamError('Invalid date value');
    }
    return time;
  }

  if (typeof value === 'string') {
    return parseStrictISOString(value);
  }

  throw new ParamError('Invalid date value');
};
