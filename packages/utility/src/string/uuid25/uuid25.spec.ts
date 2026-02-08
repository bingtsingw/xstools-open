import { describe, expect, test } from 'bun:test';
import { uuid25decode, uuid25encode } from './uuid25';

describe('uuid25', () => {
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

  // uuid25encode会保留uuid的排序顺序
  test('sort', () => {
    const unsortUuids = [
      '019a599d-af85-713f-a0e7-3792426b753b',
      '019a599e-c4bb-713c-a8d5-0e7342d66965',
      '019a599d-6165-7299-9c1c-dc99d5def01c',
      '019a599e-9daa-760f-b0ff-c44ca3829088',
      '019a599d-fda4-7014-afa1-991fbf6475b0',
      '019a599e-4bd3-730d-ab13-faff6f901baf',
      '019a599d-d694-7158-aade-20795ce91c31',
      '019a599e-24b4-7415-b2b9-30c3ad9aef6f',
      '019a599d-8876-757f-8771-7282e27276bb',
      '019a599e-72e3-740b-9253-1e24803fb597',
    ];

    // 使用字符串排序
    const sortedUuids = [...unsortUuids].sort((a, b) => a.localeCompare(b));

    const unsortUuids25 = unsortUuids.map((id) => uuid25encode(id));
    const sortedUuids25 = [...unsortUuids25].sort((a, b) => a.localeCompare(b));

    expect(sortedUuids.map((id) => uuid25encode(id))).not.toEqual(unsortUuids25);
    expect(sortedUuids.map((id) => uuid25encode(id))).toEqual(sortedUuids25);
  });
});
