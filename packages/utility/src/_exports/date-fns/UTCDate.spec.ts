import { afterEach, beforeEach, describe, expect, it, setSystemTime } from 'bun:test';
import { UTCDate } from './index.js';

describe('UTCDate', () => {
  it('creates date in UTC', () => {
    process.env.TZ = 'Asia/Shanghai';
    expect(new UTCDate(1987, 1, 11).getTime()).toBe(new Date(1987, 1, 11, 8).getTime());
  });

  describe('constructor', () => {
    it('allows to create current date', () => {
      expect(new UTCDate().getTime() - Date.now()).toBeLessThan(100);
    });

    it('allows to create date using timestamp', () => {
      expect(Number(new UTCDate(540000000000))).toBe(540000000000);
    });

    it('allows to parse the string', () => {
      expect(Number(new UTCDate('2023-05-03'))).toBe(Number(new Date('2023-05-03')));
    });

    it('allows to create date from another date', () => {
      const date = new Date();
      expect(Number(new UTCDate(date))).toBe(Number(date));
    });
  });

  describe('getDate', () => {
    it('returns UTC date', () => {
      expect(new UTCDate(1987, 1, 11, 23).getDate()).toBe(11);
    });
  });

  describe('getDay', () => {
    it('returns UTC day', () => {
      expect(new UTCDate(1987, 1, 11, 23).getDay()).toBe(3);
    });
  });

  describe('getFullYear', () => {
    it('returns UTC full year', () => {
      expect(new UTCDate(1999, 11, 31, 23).getFullYear()).toBe(1999);
    });
  });

  describe('getHours', () => {
    it('returns UTC hours', () => {
      expect(new UTCDate(1987, 1, 11, 3).getHours()).toBe(3);
    });
  });

  describe('getMilliseconds()', () => {
    // it.todo('returns UTC milliseconds');
  });

  describe('getMinutes()', () => {
    it('returns UTC minutes', () => {
      expect(new UTCDate(1987, 1, 11, 3, 30).getMinutes()).toBe(30);
    });
  });

  describe('getMonth', () => {
    it('returns UTC month', () => {
      expect(new UTCDate(1999, 11, 31, 23).getMonth()).toBe(11);
    });
  });

  describe('getSeconds', () => {
    // it.todo('returns UTC seconds');
  });

  describe('getTimezoneOffset', () => {
    it('returns 0', () => {
      expect(new UTCDate(1999, 11, 31, 23).getTimezoneOffset()).toBe(0);
    });
  });

  describe('setDate', () => {
    it('sets UTC date', () => {
      const date = new UTCDate(1987, 1, 11, 23);
      date.setDate(11);
      expect(date.getDate()).toBe(11);
    });
  });

  describe('setFullYear', () => {
    it('sets UTC full year', () => {
      const date = new UTCDate(1999, 11, 31, 23);
      date.setFullYear(1999);
      expect(date.getFullYear()).toBe(1999);
    });
  });

  describe('setHours', () => {
    it('sets UTC hours', () => {
      const date = new UTCDate(1987, 1, 11, 3, 30);
      date.setHours(4);
      expect(date.getHours()).toBe(4);
    });
  });

  describe('setMilliseconds', () => {
    // it.todo('sets UTC milliseconds');
  });

  describe('setMinutes', () => {
    it('sets UTC minutes', () => {
      const date = new UTCDate(1987, 1, 11, 3, 30);
      date.setMinutes(0);
      expect(date.getMinutes()).toBe(0);
    });
  });

  describe('setMonth', () => {
    it('sets UTC months', () => {
      const date = new UTCDate(1999, 11, 31, 23);
      date.setMonth(11);
      expect(date.getMonth()).toBe(11);
    });
  });

  describe('setSeconds', () => {
    // it.todo('sets UTC seconds');
  });

  describe('toDateString', () => {
    it('returns string representing the given date in UTC timezone', () => {
      expect(new UTCDate(1987, 1, 11, 12, 13, 14, 15).toDateString()).toBe('Wed Feb 11 1987');
    });
  });

  describe('fake times', () => {
    beforeEach(() => {
      setSystemTime(new Date(1987, 1, 11, 12, 13, 14, 15));
    });

    afterEach(() => {
      setSystemTime();
    });

    it('mocks the date', () => {
      const expected = Number(new Date(1987, 1, 11, 12, 13, 14, 15));
      expect(Number(new Date())).toBe(expected);
      expect(Number(new UTCDate())).toBe(expected);
    });
  });
});
