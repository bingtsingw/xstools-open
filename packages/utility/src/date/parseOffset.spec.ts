import { describe, expect, test } from 'bun:test';
import { ParamError } from '../error';
import { parseOffset } from './parseOffset';

describe('parseOffset', () => {
  test('parses ±HH:MM', () => {
    expect(parseOffset('+08:00')).toBe(480);
    expect(parseOffset('-05:30')).toBe(-330);
    expect(parseOffset('+00:00')).toBe(0);
  });

  test('parses ±HHMM and ±HH', () => {
    expect(parseOffset('+0800')).toBe(480);
    expect(parseOffset('-0530')).toBe(-330);
    expect(parseOffset('+08')).toBe(480);
    expect(parseOffset('-05')).toBe(-300);
  });

  test('rejects invalid offsets', () => {
    expect(() => parseOffset('Asia/Shanghai')).toThrow(ParamError);
    expect(() => parseOffset('+8')).toThrow(ParamError);
    expect(() => parseOffset('0800')).toThrow(ParamError);
    expect(() => parseOffset('+24:00')).toThrow(ParamError);
    expect(() => parseOffset('+08:60')).toThrow(ParamError);
    expect(() => parseOffset('')).toThrow(ParamError);
  });
});
