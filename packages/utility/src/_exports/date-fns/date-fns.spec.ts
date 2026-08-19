import { describe, expect, test } from 'bun:test';
import { addDays, differenceInDays, differenceInHours, differenceInMinutes, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ot } from './ot';
import { utc } from './utc';

describe('date-fns', () => {
  test('ot and utc save the same value, but differs in getXxx output', () => {
    const date = '2024-09-09T23:00:00-04:00';
    const dateUtc = utc(date);
    const date8 = ot('+08:00')(date);
    const dateM8 = ot('-08:00')(date);

    expect(dateUtc.toISOString()).toBe('2024-09-10T03:00:00.000Z');
    expect(date8.toISOString()).toBe('2024-09-10T03:00:00.000Z');
    expect(dateM8.toISOString()).toBe('2024-09-10T03:00:00.000Z');

    expect(dateUtc.getDate()).toBe(10); // 2024-09-10T03:00:00.000Z
    expect(date8.getDate()).toBe(10); // 2024-09-10T11:00:00.000+08:00
    expect(dateM8.getDate()).toBe(9); // 2024-09-09T19:00:00.000-08:00
  });

  test('addXXX', () => {
    const date = '2024-09-09T23:00:00-04:00';
    const dateUtc = utc(date);
    const date8 = ot('+08:00')(date);
    const dateM8 = ot('-08:00')(date);

    expect(addDays(dateUtc, 1).toISOString()).toBe('2024-09-11T03:00:00.000Z');
    expect(addDays(date8, 1).toISOString()).toBe('2024-09-11T03:00:00.000Z');
    expect(addDays(dateM8, 1).toISOString()).toBe('2024-09-11T03:00:00.000Z');

    expect(addDays(dateUtc, 1, { in: utc }).toISOString()).toBe('2024-09-11T03:00:00.000Z');
    expect(addDays(date8, 1, { in: utc }).toISOString()).toBe('2024-09-11T03:00:00.000Z');
    expect(addDays(dateM8, 1, { in: utc }).toISOString()).toBe('2024-09-11T03:00:00.000Z');

    // in do not affect the value
    expect(addDays(dateUtc, 1, { in: ot('+08:00') }).toISOString()).toBe('2024-09-11T03:00:00.000Z');
    expect(addDays(date8, 1, { in: ot('-08:00') }).toISOString()).toBe('2024-09-11T03:00:00.000Z');
    expect(addDays(dateM8, 1, { in: ot('+08:00') }).toISOString()).toBe('2024-09-11T03:00:00.000Z');

    // return `in` instance
    expect(addDays(dateUtc, 1, { in: utc }).getHours()).toBe(3);
    expect(addDays(dateUtc, 1, { in: ot('-08:00') }).getHours()).toBe(19);
    expect(addDays(dateUtc, 1, { in: ot('+08:00') }).getHours()).toBe(11);
  });

  test('format', () => {
    const date = '2024-09-09T23:00:00-04:00';
    const dateUtc = utc(date);
    const date8 = ot('+08:00')(date);
    const dateM8 = ot('-08:00')(date);

    // format respect timezone
    expect(format(dateUtc, 'yyyy-MM-dd HH:mm:ss')).toBe('2024-09-10 03:00:00');
    expect(format(dateUtc, 'iii', { locale: zhCN })).toBe('周二');
    expect(format(date8, 'yyyy-MM-dd HH:mm:ss')).toBe('2024-09-10 11:00:00');
    expect(format(date8, 'iii', { locale: zhCN })).toBe('周二');
    expect(format(dateM8, 'yyyy-MM-dd HH:mm:ss')).toBe('2024-09-09 19:00:00');
    expect(format(dateM8, 'iii', { locale: zhCN })).toBe('周一');

    // format respect in
    expect(format(dateUtc, 'yyyy-MM-dd HH:mm:ss', { in: ot('+08:00') })).toBe('2024-09-10 11:00:00');
    expect(format(dateUtc, 'iii', { locale: zhCN, in: ot('+08:00') })).toBe('周二');
    expect(format(date8, 'yyyy-MM-dd HH:mm:ss', { in: utc })).toBe('2024-09-10 03:00:00');
    expect(format(date8, 'iii', { locale: zhCN, in: utc })).toBe('周二');
    expect(format(dateM8, 'yyyy-MM-dd HH:mm:ss', { in: ot('+08:00') })).toBe('2024-09-10 11:00:00');
    expect(format(dateM8, 'iii', { locale: zhCN, in: ot('+08:00') })).toBe('周二');
  });

  test('difference', () => {
    const dateUtc = utc('2024-09-09T23:00:00-04:00');
    const date8 = ot('+08:00')('2024-09-09T23:01:00-04:00');
    const dateM8 = ot('-08:00')('2024-09-09T21:59:00-04:00');

    expect(differenceInMinutes(dateUtc, date8)).toBe(-1);
    expect(differenceInMinutes(date8, dateM8)).toBe(62);

    expect(differenceInHours(dateUtc, date8)).toBe(0);
    expect(differenceInHours(date8, dateM8)).toBe(1);

    expect(differenceInDays(dateUtc, date8)).toBe(0);
    expect(differenceInDays(date8, dateM8)).toBe(0);
  });
});
