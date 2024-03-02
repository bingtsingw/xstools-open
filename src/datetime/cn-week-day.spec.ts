import { describe, expect, test } from 'bun:test';
import { cnWeekDay } from './cn-week-day';

describe('cn-week-day', () => {
  test('cnWeekDay', () => {
    expect(cnWeekDay('2023-10-01')).toBe('周日');
    expect(cnWeekDay('2023-10-02')).toBe('周一');
    expect(cnWeekDay('2023-10-03')).toBe('周二');
    expect(cnWeekDay('2023-10-04')).toBe('周三');
    expect(cnWeekDay('2023-10-05')).toBe('周四');
    expect(cnWeekDay('2023-10-06')).toBe('周五');
    expect(cnWeekDay('2023-10-07')).toBe('周六');
  });
});
