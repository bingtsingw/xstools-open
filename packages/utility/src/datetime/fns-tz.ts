import { addDays, parseISO, startOfDay, startOfMonth } from 'date-fns';
import { utc } from '../_exports/date-fns';
import { tz } from '../_exports/date-fns/tz';

/**
 * Treat the `date` string as in `offset` timezone, and return the start of day in UTC.
 *
 * @example
 * startOfDayInTimeZone({ date: '2000-01-01 15:59:00', offset: '+08:00' }) // => 1999-12-31T16:00:00.000Z
 * startOfDayInTimeZone({ date: '2000-01-01 16:01:00', offset: '+08:00' }) // => 2000-01-01T16:00:00.000Z
 */
export const startOfDayInTimeZone = ({ date, offset }: { date: string; offset: string }): Date => {
  const utcDate = parseISO(date, { in: utc });

  return startOfDay(utcDate, { in: tz(offset) });
};

/**
 * Treat the `date` string as in `offset` timezone, and return the start of month in UTC.
 *
 * @example
 * startOfMonthInTimeZone({ date: '2000-01-01 15:59:00', offset: '+08:00' }) // => 1999-12-01T16:00:00.000Z
 */
export const startOfMonthInTimeZone = ({ date, offset }: { date: string; offset: string }): Date => {
  const utcDate = parseISO(date, { in: utc });

  return startOfMonth(utcDate, { in: tz(offset) });
};

/**
 * 延长/减少VIP天数.
 *
 */
export const addVipDays = ({ vipTo, duration, offset }: { vipTo?: string; duration: number; offset: string }): Date => {
  let from = new Date();

  // 如果已经是vip, 天数则从最新开始算起; 如果不是vip或者已过期, 天数从当前算起
  if (vipTo) {
    const vipToDateTime = parseISO(vipTo);
    if (vipToDateTime > from) {
      from = vipToDateTime;
    }
  }

  let extraDay = 1;
  if (duration < 0) {
    extraDay = -1;
  }

  return addDays(startOfDayInTimeZone({ offset, date: from.toISOString() }), extraDay + duration);
};
