import { describe, expect, test } from 'bun:test';
import { shake } from './shake';

describe('shake', () => {
  test('removes undefined values by default', () => {
    expect(
      shake({
        x: 2,
        y: null,
        z: undefined,
        o: false,
        r: 'x',
      }),
    ).toEqual({
      x: 2,
      y: null,
      o: false,
      r: 'x',
    });
  });

  test('keeps falsy values other than undefined', () => {
    expect(shake({ a: 0, b: false, c: '', d: null })).toEqual({
      a: 0,
      b: false,
      c: '',
      d: null,
    });
  });

  test('removes values based on filter', () => {
    expect(
      shake(
        {
          x: 2,
          y: null,
          z: undefined,
          o: false,
          r: 'x',
        },
        (val) => val !== 'x',
      ),
    ).toEqual({
      r: 'x',
    });
    expect(shake({ a: 1, b: 'omit', c: 3 }, (value) => typeof value === 'string')).toEqual({ a: 1, c: 3 });
    expect(shake({ a: 1, b: 2 }, () => false)).toEqual({ a: 1, b: 2 });
    expect(shake({ a: 1, b: 2 }, () => true)).toEqual({});
  });

  test('custom filter can keep undefined', () => {
    expect(shake({ a: undefined, b: 1 }, () => false)).toEqual({ a: undefined, b: 1 });
  });

  test('nullish or non-object input', () => {
    expect(shake(undefined)).toEqual({});
    expect(shake(null)).toEqual({});
    expect(shake(1 as any)).toEqual({});
  });

  test('empty object', () => {
    expect(shake({})).toEqual({});
  });

  test('does not mutate original', () => {
    const obj = { a: 1, b: undefined };
    const result = shake(obj);
    expect(result).toEqual({ a: 1 });
    expect(obj).toEqual({ a: 1, b: undefined });
  });

  test('ignores own symbol keys', () => {
    const sym = Symbol('s');
    const obj = { a: 1, [sym]: 2 };
    expect(shake(obj)).toEqual({ a: 1 });
  });
});
