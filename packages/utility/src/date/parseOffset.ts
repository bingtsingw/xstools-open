import { ParamError } from '../error';

/**
 * Parse a fixed UTC offset string into minutes.
 *
 * Accepted: `±HH`, `±HHMM`, `±HH:MM` (e.g. `+08`, `+0800`, `+08:00`, `-05:30`).
 * IANA names and other forms are rejected.
 *
 * @param offset - Fixed offset string
 * @returns Offset minutes with the same sign as the offset (`+08:00` → `480`)
 * @throws {ParamError} When `offset` is not a fixed offset string
 *
 * @example
 * parseOffset('+08:00') // => 480
 * parseOffset('-0530') // => -330
 */
export const parseOffset = (offset: string): number => {
  if (typeof offset !== 'string') {
    throw new ParamError('Invalid UTC offset');
  }

  const matched = offset.match(/^([+-])(\d{2})(?::?(\d{2}))?$/);
  if (!matched) {
    throw new ParamError('Invalid UTC offset');
  }

  const sign = matched[1] === '-' ? -1 : 1;
  const hours = Number(matched[2]);
  const minutes = Number(matched[3] ?? 0);

  if (hours > 23 || minutes > 59) {
    throw new ParamError('Invalid UTC offset');
  }

  return sign * (hours * 60 + minutes);
};
