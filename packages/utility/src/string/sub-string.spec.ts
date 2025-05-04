import { describe, expect, test } from 'bun:test';
import { subString } from './sub-string';

describe('subString', () => {
  test('normal usage', () => {
    expect(subString('123', 2)).toBe('12');
    expect(subString('123', 10)).toBe('123');

    expect(subString('今天很开心🌸🌸🌸', 6)).toBe('今天很开心🌸');
    expect('今天很开心🌸🌸🌸'.substring(0, 6)).toBe('今天很开心\ud83c');
  });

  test('unicode support', () => {
    expect(subString('𝒽𝑒𝓁𝓁𝑜 𝓌𝑜𝓇𝓁𝒹', 1)).toBe('𝒽');
    expect('𝒽𝑒𝓁𝓁𝑜 𝓌𝑜𝓇𝓁𝒹'.substring(0, 2)).toBe('𝒽');

    expect(subString('🐶狗', 1)).toBe('🐶');
    expect('🐶狗'.substring(0, 2)).toBe('🐶');

    expect(subString('狗狗', 1)).toBe('狗');
    expect('狗狗'.substring(0, 1)).toBe('狗');

    // https://juejin.cn/post/7070079762429034526
    expect(subString('🐕‍🦺狗', 1)).toBe('🐕');
    expect('🐕‍🦺狗'.substring(0, 2)).toBe('🐕');
  });

  test('empty', () => {
    expect(subString('xxx', 0)).toBe('');
    expect(subString('', 0)).toBe('');
    expect(subString('', 10)).toBe('');

    // @ts-expect-error
    expect(subString({}, 10)).toBe('');
    // @ts-expect-error
    expect(subString(1, 10)).toBe('');
    // @ts-expect-error
    expect(subString([1], 10)).toBe('');
  });
});
