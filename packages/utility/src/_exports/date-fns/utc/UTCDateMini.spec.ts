import { afterEach, beforeEach, describe, expect, setSystemTime, test } from 'bun:test';
import { isSameDay, parseISO, startOfDay } from 'date-fns';
import { ParamError } from '../../../error';
import { UTCDateMini } from './UTCDateMini';
import { utc } from './utc';

describe('UTCDateMini', () => {
  test('rejects date component arguments', () => {
    expect(() => new (UTCDateMini as unknown as new (...args: number[]) => UTCDateMini)(1987, 1, 11)).toThrow(
      ParamError,
    );
  });

  test('rejects non-strict ISO strings', () => {
    expect(() => new UTCDateMini('2023-05-03')).toThrow(ParamError);
    expect(() => new UTCDateMini('2023-05-03T00:00:00')).toThrow(ParamError);
    expect(() => new UTCDateMini('2000-01-01 15:59:00')).toThrow(ParamError);
  });

  describe('constructor', () => {
    test('allows to create current date', () => {
      expect(new UTCDateMini().getTime() - Date.now()).toBeLessThan(100);
    });

    test('allows to create date using timestamp', () => {
      expect(Number(new UTCDateMini(540000000000))).toBe(540000000000);
      expect(new UTCDateMini(Date.UTC(1987, 1, 11)).getTime()).toBe(Date.UTC(1987, 1, 11));
    });

    test('allows to parse a strict ISO string', () => {
      expect(Number(new UTCDateMini('2023-05-03T00:00:00.000Z'))).toBe(Date.UTC(2023, 4, 3));
      expect(new UTCDateMini('2023-05-03T00:00:00+08:00').toISOString()).toBe('2023-05-02T16:00:00.000Z');
    });

    test('allows to create date from another date', () => {
      const date = new Date(Date.UTC(2020, 0, 1));
      expect(Number(new UTCDateMini(date))).toBe(Number(date));
    });
  });

  describe('getters', () => {
    test('getDate returns UTC date', () => {
      expect(new UTCDateMini(Date.UTC(1987, 1, 11, 23)).getDate()).toBe(11);
    });

    test('getDay returns UTC day', () => {
      expect(new UTCDateMini(Date.UTC(1987, 1, 11, 23)).getDay()).toBe(3);
    });

    test('getFullYear returns UTC full year', () => {
      expect(new UTCDateMini(Date.UTC(1999, 11, 31, 23)).getFullYear()).toBe(1999);
    });

    test('getHours returns UTC hours', () => {
      expect(new UTCDateMini(Date.UTC(1987, 1, 11, 3)).getHours()).toBe(3);
    });

    test('getMilliseconds returns UTC milliseconds', () => {
      expect(new UTCDateMini(Date.UTC(1987, 1, 11, 3, 30, 15, 123)).getMilliseconds()).toBe(123);
    });

    test('getMinutes returns UTC minutes', () => {
      expect(new UTCDateMini(Date.UTC(1987, 1, 11, 3, 30)).getMinutes()).toBe(30);
    });

    test('getMonth returns UTC month', () => {
      expect(new UTCDateMini(Date.UTC(1999, 11, 31, 23)).getMonth()).toBe(11);
    });

    test('getSeconds returns UTC seconds', () => {
      expect(new UTCDateMini(Date.UTC(1987, 1, 11, 3, 30, 15)).getSeconds()).toBe(15);
    });

    test('getTimezoneOffset returns 0', () => {
      expect(new UTCDateMini(Date.UTC(1999, 11, 31, 23)).getTimezoneOffset()).toBe(0);
    });
  });

  describe('setters', () => {
    test('setDate sets UTC date', () => {
      const date = new UTCDateMini(Date.UTC(1987, 1, 11, 23));
      date.setDate(12);
      expect(date.getDate()).toBe(12);
      expect(date.getTime()).toBe(Date.UTC(1987, 1, 12, 23));
    });

    test('setFullYear sets UTC full year', () => {
      const date = new UTCDateMini(Date.UTC(1999, 11, 31, 23));
      date.setFullYear(2000);
      expect(date.getFullYear()).toBe(2000);
      expect(date.getTime()).toBe(Date.UTC(2000, 11, 31, 23));
    });

    test('setHours sets UTC hours', () => {
      const date = new UTCDateMini(Date.UTC(1987, 1, 11, 3, 30));
      date.setHours(4);
      expect(date.getHours()).toBe(4);
      expect(date.getTime()).toBe(Date.UTC(1987, 1, 11, 4, 30));
    });

    test('setMilliseconds sets UTC milliseconds', () => {
      const date = new UTCDateMini(Date.UTC(1987, 1, 11, 3, 30, 15, 0));
      date.setMilliseconds(456);
      expect(date.getMilliseconds()).toBe(456);
    });

    test('setMinutes sets UTC minutes', () => {
      const date = new UTCDateMini(Date.UTC(1987, 1, 11, 3, 30));
      date.setMinutes(0);
      expect(date.getMinutes()).toBe(0);
      expect(date.getTime()).toBe(Date.UTC(1987, 1, 11, 3, 0));
    });

    test('setMonth sets UTC months', () => {
      const date = new UTCDateMini(Date.UTC(1999, 11, 15, 23));
      date.setMonth(10);
      expect(date.getMonth()).toBe(10);
      expect(date.getTime()).toBe(Date.UTC(1999, 10, 15, 23));
    });

    test('setSeconds sets UTC seconds', () => {
      const date = new UTCDateMini(Date.UTC(1987, 1, 11, 3, 30, 0));
      date.setSeconds(45);
      expect(date.getSeconds()).toBe(45);
      expect(date.getTime()).toBe(Date.UTC(1987, 1, 11, 3, 30, 45));
    });
  });

  describe('fake times', () => {
    const frozen = Date.UTC(1987, 1, 11, 12, 13, 14, 15);

    beforeEach(() => {
      setSystemTime(new Date(frozen));
    });

    afterEach(() => {
      setSystemTime();
    });

    test('mocks the date', () => {
      expect(Number(new Date())).toBe(frozen);
      expect(Number(new UTCDateMini())).toBe(frozen);
    });
  });
});

describe('utc', () => {
  const dateStr = '2020-01-01T08:00:00.000+08:00';

  test('creates a UTCDateMini', () => {
    expect(utc(dateStr)).toBeInstanceOf(UTCDateMini);
    expect(utc(dateStr).toISOString()).toBe('2020-01-01T00:00:00.000Z');
    expect(utc(Number(new Date(dateStr))).toISOString()).toBe('2020-01-01T00:00:00.000Z');
    expect(utc(new Date(dateStr)).toISOString()).toBe('2020-01-01T00:00:00.000Z');
  });

  test('works as date-fns in context', () => {
    expect(isSameDay('2024-09-09T23:00:00-04:00', '2024-09-10T10:00:00+08:00', { in: utc })).toBe(true);
    expect(isSameDay('2024-09-09T23:00:00-04:00', '2024-09-10T07:00:00+08:00', { in: utc })).toBe(false);

    const parsed = parseISO('2000-01-01 15:59:00', { in: utc });
    expect(parsed).toBeInstanceOf(UTCDateMini);
    expect(parsed.toISOString()).toBe('2000-01-01T15:59:00.000Z');

    expect(startOfDay(parsed, { in: utc }).toISOString()).toBe('2000-01-01T00:00:00.000Z');
  });
});
