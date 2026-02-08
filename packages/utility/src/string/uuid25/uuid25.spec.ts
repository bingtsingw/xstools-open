import { describe, expect, test } from 'bun:test';
import { uuid25decode, uuid25encode } from './uuid25';

describe.only('uuid25', () => {
  test('uuid25encode', () => {
    expect(uuid25encode('00503ecb-1584-4ca2-b698-bee4c18eb00b')).toBe('00o1tfx24cui2qh801gau5ukr');

    expect(() => uuid25encode('00503ecb-1584-4ca2-b698-bee4c18eb00b-')).toThrow('invalid input');
    expect(() => uuid25encode('00503ecb-1584-4ca2-b698-bee4c18eb00g')).toThrow('invalid uuid');
  });

  test('uuid25decode', () => {
    expect(uuid25decode('00o1tfx24cui2qh801gau5ukr')).toBe('00503ecb-1584-4ca2-b698-bee4c18eb00b');
    expect(uuid25decode('f5lxx1zz5pnorynqglhzmsp33')).toBe('ffffffff-ffff-ffff-ffff-ffffffffffff');
    expect(uuid25decode('f5lxx1zz5pnorynqglhzmsp32')).toBe('ffffffff-ffff-ffff-ffff-fffffffffffe');

    expect(() => uuid25decode('00o1tfx24cui2qh801gau5uk')).toThrow('invalid input');
    expect(() => uuid25decode('f5lxx1zz5pnorynqglhzmsp34')).toThrow('128-bit overflow');
  });
});
