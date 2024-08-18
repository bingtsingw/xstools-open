import { describe, expect, test } from 'bun:test';
import { get } from './get';

describe('get', () => {
  test('normal usage', () => {
    // return path value
    expect(get({ a: { b: 3 } }, 'a.b')).toBe(3);
    expect(get({ a: { b: 3 } }, 'a.b', 4)).toBe(3);
    expect(get({ a: { b: null } }, 'a.b')).toEqual(null);
    expect(get({ a: { b: null } }, 'a.b', 4)).toEqual(null as any);
    expect(get({ a: { b: undefined } }, 'a.b')).toEqual(undefined);
    expect(get({ a: { b: undefined } }, 'a.b', 4)).toEqual(4);

    // return array path value
    expect(get({ a: [{ b: 3 }] }, 'a[].b')).toBe(undefined);
    expect(get({ a: [{ b: 3 }] }, 'a[0].b')).toBe(3);
    expect(get<number>({ a: [{ b: 3 }] }, 'a.0.b')).toBe(3);

    // return default value
    expect(get({ a: { b: 3 } }, 'a.c', null)).toBe(null);
    expect(get({ a: { b: 3 } }, 'a.d', 4)).toBe(4);
    expect(get({ a: { b: 3 } }, 'a.e', undefined)).toBe(undefined);
  });

  test(`get key over path`, () => {
    expect(get({ 'a.b': 1, a: { b: 2 } }, 'a.b')).toBe(1);
  });

  test(`handle empty path`, () => {
    // empty bracket
    expect(get({ a: { '': 1 } }, 'a[]')).toBe(1);

    // empty path
    expect(get({}, '', 'a')).toBe('a');
    expect(get({}, '')).toBe(undefined);
    expect(get({ '': 3 }, '')).toBe(3);
  });

  test('get number path', () => {
    expect(get({ '-0': 'a', 0: 'b' }, '-0')).toBe('a');
    expect(get<string>({ '-0': 'a', 0: 'b' }, '0')).toBe('b');

    expect(get({ '1.23': 'a' }, '1.23')).toBe('a'); // 1.23会直接当作key
    expect(get({ x: { '1.23': 'a' } }, 'x.1.23')).toBeUndefined(); // 1.23不会被当作key
    expect(get<string>({ x: { '1.23': 'a' } }, 'x[1.23]')).toBe('a'); // 1.23在[]中会被当作key
  });

  test(`handle complex path`, () => {
    expect(
      get<number>(
        { a: { '-1.23': { '["b"]': { c: { "['d']": { '\ne\n': { f: { g: 8 } } } } } } } },
        'a[-1.23]["[\\"b\\"]"].c[\'[\\\'d\\\']\'][\ne\n][f].g',
      ),
    ).toBe(8);
  });

  test('handle prototype', () => {
    expect(get(null, 'constructor')).toBe(undefined);
    expect(get(null, 'constructor.prototype.valueOf')).toEqual(undefined);

    // @ts-expect-error
    // eslint-disable-next-line no-extend-native
    Number.prototype.a = { b: 2 };
    expect(get<number>(0, 'a.b')).toEqual(2);

    // @ts-expect-error
    delete Number.prototype.a;
  });
});
