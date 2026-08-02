import { describe, expect, test } from 'bun:test';
import { ParamError } from '../error';
import { parseStrictISOString, toEpoch } from './toEpoch';

describe('parseStrictISOString', () => {
  test('parses Z and numeric offsets', () => {
    expect(parseStrictISOString('2023-05-03T00:00:00.000Z')).toBe(Date.UTC(2023, 4, 3));
    expect(parseStrictISOString('2020-01-01T08:00:00+08:00')).toBe(Date.UTC(2020, 0, 1));
    expect(parseStrictISOString('2020-01-01T08:00:00+0800')).toBe(Date.UTC(2020, 0, 1));
    expect(parseStrictISOString('2024-09-09T23:00:00-04:00')).toBe(Date.UTC(2024, 8, 10, 3));
  });

  test('rejects non-instant forms', () => {
    expect(() => parseStrictISOString('2023-05-03')).toThrow(ParamError);
    expect(() => parseStrictISOString('2023-05-03T00:00:00')).toThrow(ParamError);
    expect(() => parseStrictISOString('2000-01-01 15:59:00')).toThrow(ParamError);
    expect(() => parseStrictISOString('Asia/Shanghai')).toThrow(ParamError);
    expect(() => parseStrictISOString('')).toThrow(ParamError);
  });
});

describe('toEpoch', () => {
  test('accepts number, Date, and strict ISO string', () => {
    expect(toEpoch(540000000000)).toBe(540000000000);
    expect(toEpoch(new Date(Date.UTC(2020, 0, 1)))).toBe(Date.UTC(2020, 0, 1));
    expect(toEpoch('2020-01-01T00:00:00.000Z')).toBe(Date.UTC(2020, 0, 1));
  });

  test('rejects invalid values', () => {
    expect(() => toEpoch(Number.NaN)).toThrow(ParamError);
    expect(() => toEpoch(new Date(Number.NaN))).toThrow(ParamError);
    expect(() => toEpoch('2023-05-03')).toThrow(ParamError);
  });
});
