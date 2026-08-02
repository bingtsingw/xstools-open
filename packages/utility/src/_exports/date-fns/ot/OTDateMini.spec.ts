import { describe, expect, test } from 'bun:test';
import { constructFrom, startOfDay, startOfMonth } from 'date-fns';
import { ParamError } from '../../../error';
import { utc } from '../utc';
import { OTDateMini } from './OTDateMini';
import { ot } from './ot';

describe('OTDateMini', () => {
  test('requires a fixed offset', () => {
    expect(() => new (OTDateMini as unknown as new (value: number) => OTDateMini)(Date.now())).toThrow(ParamError);
  });

  test('rejects date component arguments', () => {
    expect(
      () => new (OTDateMini as unknown as new (...args: Array<number | string>) => OTDateMini)(2000, 0, 1, '+08:00'),
    ).toThrow(ParamError);
  });

  test('rejects non-strict ISO strings', () => {
    expect(() => new OTDateMini('2000-01-01', '+08:00')).toThrow(ParamError);
    expect(() => new OTDateMini('2000-01-01T00:00:00', '+08:00')).toThrow(ParamError);
    expect(() => new OTDateMini('2000-01-01 00:00:00', '+08:00')).toThrow(ParamError);
  });

  test('timestamp, Date, and strict ISO keep the same instant', () => {
    const ts = Date.UTC(2000, 0, 1, 0, 0, 0);
    expect(new OTDateMini(ts, '+08:00').getTime()).toBe(ts);
    expect(new OTDateMini(new Date(ts), '+00:00').getTime()).toBe(ts);
    expect(new OTDateMini('2000-01-01T00:00:00.000Z', '+08:00').getTime()).toBe(ts);
    expect(new OTDateMini(ts, '+08:00').getHours()).toBe(8);
  });

  test('setters adjust the instant via offset wall clock', () => {
    const date = new OTDateMini(Date.UTC(2000, 0, 1, 0), '+08:00');
    date.setHours(0, 0, 0, 0);
    expect(date.toISOString()).toBe('1999-12-31T16:00:00.000Z');
    expect(date.getHours()).toBe(0);
  });

  test('constructFrom preserves offset', () => {
    const base = new OTDateMini(Date.UTC(2000, 0, 1), '+08:00');
    const constructed = constructFrom(base, Date.UTC(2000, 0, 2));

    expect(constructed).toBeInstanceOf(OTDateMini);
    expect(constructed.offset).toBe('+08:00');
    expect(constructed.getTime()).toBe(Date.UTC(2000, 0, 2));
    expect(constructed.getHours()).toBe(8);
  });

  test('static ot and withOffset', () => {
    const date = OTDateMini.ot('+09:00', Date.UTC(2000, 0, 1));
    expect(date.getHours()).toBe(9);
    expect(date.withOffset('+00:00').getHours()).toBe(0);
  });
});

describe('ot', () => {
  test('creates OTDateMini for date-fns in context', () => {
    const date = ot('+08:00')('2000-01-01T15:59:00.000Z');
    expect(date).toBeInstanceOf(OTDateMini);
    expect(startOfDay(date, { in: ot('+08:00') }).toISOString()).toBe('1999-12-31T16:00:00.000Z');
    expect(startOfMonth(date, { in: ot('+08:00') }).toISOString()).toBe('1999-12-31T16:00:00.000Z');

    expect(startOfDay('2000-01-01T15:59:00.000Z', { in: ot('+08:00') }).toISOString()).toBe('1999-12-31T16:00:00.000Z');
    expect(startOfMonth('2000-01-01T15:59:00.000Z', { in: ot('+08:00') }).toISOString()).toBe(
      '1999-12-31T16:00:00.000Z',
    );

    expect(startOfDay(utc('2000-01-01T15:59:00.000Z'), { in: ot('+08:00') }).toISOString()).toBe(
      '1999-12-31T16:00:00.000Z',
    );
    expect(startOfMonth(utc('2000-01-01T15:59:00.000Z'), { in: ot('+08:00') }).toISOString()).toBe(
      '1999-12-31T16:00:00.000Z',
    );
  });

  test('rejects IANA time zones and non-strict ISO values', () => {
    expect(() => ot('Asia/Shanghai')).toThrow(ParamError);
    expect(() => ot('+08:00')('2000-01-01')).toThrow(ParamError);
  });

  test('strict ISO instant is stable across host time zones', () => {
    const previousTz = process.env.TZ;
    try {
      for (const tz of ['UTC', 'America/New_York', 'Asia/Shanghai']) {
        process.env.TZ = tz;
        const date = ot('+08:00')('2000-01-01T00:00:00.000Z');
        expect(date.getTime()).toBe(Date.UTC(2000, 0, 1));
        expect(date.getHours()).toBe(8);
      }
    } finally {
      process.env.TZ = previousTz;
    }
  });
});
