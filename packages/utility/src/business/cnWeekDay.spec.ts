import { afterEach, describe, expect, test } from 'bun:test';
import { ParamError } from '../error';
import { cnWeekDay } from './cnWeekDay';

describe('cnWeekDay', () => {
  const previousTz = process.env.TZ;

  afterEach(() => {
    process.env.TZ = previousTz;
  });

  test('maps ISO dates to 周x (UTC calendar)', () => {
    expect(cnWeekDay('2023-10-01')).toBe('周日');
    expect(cnWeekDay('2023-10-02')).toBe('周一');
    expect(cnWeekDay('2023-10-03')).toBe('周二');
    expect(cnWeekDay('2023-10-04')).toBe('周三');
    expect(cnWeekDay('2023-10-05')).toBe('周四');
    expect(cnWeekDay('2023-10-06')).toBe('周五');
    expect(cnWeekDay('2023-10-07')).toBe('周六');
  });

  test('instant strings use UTC weekday, independent of host TZ', () => {
    for (const tz of ['UTC', 'America/Los_Angeles', 'Asia/Shanghai']) {
      process.env.TZ = tz;
      expect(cnWeekDay('2023-10-01T00:30:00.000Z')).toBe('周日');
    }
  });

  test('rejects invalid date strings', () => {
    expect(() => cnWeekDay('')).toThrow(ParamError);
    expect(() => cnWeekDay('not-a-date')).toThrow(ParamError);
    expect(() => cnWeekDay('2023-13-01')).toThrow(ParamError);
  });
});
