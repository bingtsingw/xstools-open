import { describe, expect, test } from 'bun:test';
import { constructFrom, startOfDay, startOfMonth } from 'date-fns';
import { ParamError } from '../../../error';
import { OTDateMini } from './OTDateMini';
import { ot } from './ot';

describe('OTDateMini', () => {
  test('requires a fixed offset', () => {
    expect(() => new (OTDateMini as unknown as new (value: number) => OTDateMini)(Date.now())).toThrow(ParamError);
  });

  test('component args are wall clock in the offset', () => {
    const date = new OTDateMini(2000, 0, 1, 0, 0, 0, 0, '+08:00');
    expect(date.toISOString()).toBe('1999-12-31T16:00:00.000Z');
    expect(date.getFullYear()).toBe(2000);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(1);
    expect(date.getHours()).toBe(0);
    expect(date.getTimezoneOffset()).toBe(-480);
  });

  test('timestamp and Date args keep the same instant', () => {
    const ts = Date.UTC(2000, 0, 1, 0, 0, 0);
    expect(new OTDateMini(ts, '+08:00').getTime()).toBe(ts);
    expect(new OTDateMini(new Date(ts), '+00:00').getTime()).toBe(ts);
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
    expect(constructed.timeZone).toBe('+08:00');
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
  });

  test('rejects IANA time zones', () => {
    expect(() => ot('Asia/Shanghai')).toThrow(ParamError);
  });
});
