import { getDay, isValid, parseISO, utc } from '../_exports/date-fns';
import { ParamError } from '../error';

type CnWeekDay = '周日' | '周一' | '周二' | '周三' | '周四' | '周五' | '周六';

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] as const;

/**
 * ISO 日期字符串 → 中文「周x」（按 **UTC 日历日**，与宿主时区无关）。
 *
 * @example
 * cnWeekDay('2023-10-01') // => '周日'
 * cnWeekDay('2023-10-01T00:30:00.000Z') // => '周日'
 *
 * @throws {ParamError} 当 `date` 无法解析为有效日期
 */
export const cnWeekDay = (date: string): CnWeekDay => {
  const parsed = parseISO(date, { in: utc });
  if (!isValid(parsed)) {
    throw new ParamError('Invalid date string');
  }

  return WEEKDAYS[getDay(parsed) as 0 | 1 | 2 | 3 | 4 | 5 | 6];
};
