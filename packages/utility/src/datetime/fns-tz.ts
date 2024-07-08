import { addDays, parseISO, startOfDay, startOfMonth } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export const startOfDayTz = ({ date, tz }: { date?: Date; tz: string }): Date => {
  const zoned = utcToZonedTime(date || new Date(), tz);

  return zonedTimeToUtc(startOfDay(zoned), tz);
};

export const startOfMonthTz = ({ date, tz }: { date?: Date; tz: string }): Date => {
  const zoned = utcToZonedTime(date || new Date(), tz);

  return zonedTimeToUtc(startOfMonth(zoned), tz);
};

/**
 * 延长/减少VIP天数.
 * @param param0
 * @returns
 */
export const addVipDays = ({ vipTo, duration, tz }: { vipTo?: string; duration: number; tz: string }): Date => {
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

  return addDays(startOfDayTz({ tz, date: from }), extraDay + duration);
};
