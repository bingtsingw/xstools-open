import { describe, expect, test } from 'bun:test';
import { chars2digits, convertBase, digits2chars, uuid } from './_utils';

describe.only('uuid25/_utils', () => {
  test('uuid.assert', () => {
    expect(() => uuid.assert('00503ecb-1584-4ca2-b698-bee4c18eb00b')).not.toThrow();
    expect(() => uuid.assert('00503ecb-1584-4ca2-b698-bee4c18eb00b-')).toThrow('invalid uuid');
    expect(() => uuid.assert('00503ecb')).toThrow('invalid uuid');
    expect(() => uuid.assert('00503ecb-1584-4ca2-b698-bee4c18eb00g')).toThrow('invalid uuid');
  });

  test('uuid.cleanDash', () => {
    expect(uuid.cleanDash('00503ecb-1584-4ca2-b698-bee4c18eb00b')).toBe('00503ecb15844ca2b698bee4c18eb00b');
    expect(() => uuid.cleanDash('00503ecb')).toThrow('invalid uuid');
  });

  test('uuid.addDash', () => {
    expect(uuid.addDash('00503ecb15844ca2b698bee4c18eb00b')).toBe('00503ecb-1584-4ca2-b698-bee4c18eb00b');
    expect(() => uuid.addDash('00503ecb')).toThrow('invalid uuid');
  });

  test('chars2digits', () => {
    expect(chars2digits('0')).toEqual(new Uint8Array([0]));
    expect(chars2digits('0afz')).toEqual(new Uint8Array([0, 10, 15, 35]));
    expect(chars2digits('0AFZ')).toEqual(new Uint8Array([0, 10, 15, 35]));

    expect(() => chars2digits('-')).toThrow('invalid chars');
  });

  test('digits2chars', () => {
    // prettier-ignore
    const d1 = new Uint8Array([0, 0, 5, 0, 3, 14, 12, 11, 1, 5, 8, 4, 4, 12, 10, 2, 11, 6, 9, 8, 11, 14, 14, 4, 12, 1, 8, 14, 11, 0, 0, 11]);
    expect(digits2chars(d1)).toBe('00503ecb15844ca2b698bee4c18eb00b');

    // prettier-ignore
    const d2 = new Uint8Array([0, 0, 24, 1, 29, 15, 33, 2, 4, 12, 30, 18, 2, 26, 17, 8, 0, 1, 16, 10, 30, 5, 30, 20, 27]);
    expect(digits2chars(d2)).toBe('00o1tfx24cui2qh801gau5ukr');

    const d3 = new Uint8Array([0]);
    expect(() => digits2chars(d3)).toThrow('invalid length of digit value array');

    // prettier-ignore
    const d4 = new Uint8Array([36, 0, 24, 1, 29, 15, 33, 2, 4, 12, 30, 18, 2, 26, 17, 8, 0, 1, 16, 10, 30, 5, 30, 20, 27]);
    expect(() => digits2chars(d4)).toThrow('invalid digit value');
  });

  test('convertBase', () => {
    const src = new Uint8Array([15, 15]);
    expect(convertBase({ src, srcBase: 16, dstBase: 10, dstSize: 3 })).toEqual(new Uint8Array([2, 5, 5]));
    expect(convertBase({ src, srcBase: 16, dstBase: 10, dstSize: 5 })).toEqual(new Uint8Array([0, 0, 2, 5, 5]));
    expect(() => convertBase({ src, srcBase: 16, dstBase: 10, dstSize: 2 })).toThrow('too small dst');

    expect(() => convertBase({ src, srcBase: 15, dstBase: 10, dstSize: 3 })).toThrow('invalid src digit');
  });
});
