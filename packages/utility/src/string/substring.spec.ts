import { describe, expect, test } from 'bun:test';
import { substring } from './substring';

describe('substring', () => {
  test('normal usage', () => {
    expect(substring('123', 2)).toBe('12');
    expect(substring('123', 10)).toBe('123');

    expect(substring('hello world', 5)).toBe('hello');
    expect(substring('hello🌸', 5)).toBe('hello');
    expect(substring('hello🌸', 6)).toBe('hello🌸');
    expect(substring('hello🌸', 10)).toBe('hello🌸');
    expect(substring('hello world', 7)).toBe('hello w');

    expect(substring('今天很开心🌸🌸🌸', 6)).toBe('今天很开心🌸');
    expect('今天很开心🌸🌸🌸'.substring(0, 6)).toBe('今天很开心\ud83c');
  });

  test('unicode support', () => {
    expect(substring('𝒽𝑒𝓁𝓁𝑜 𝓌𝑜𝓇𝓁𝒹', 1)).toBe('𝒽');
    expect('𝒽𝑒𝓁𝓁𝑜 𝓌𝑜𝓇𝓁𝒹'.substring(0, 2)).toBe('𝒽');

    expect(substring('🐶狗', 1)).toBe('🐶');
    expect('🐶狗'.substring(0, 2)).toBe('🐶');

    expect(substring('狗狗', 1)).toBe('狗');
    expect('狗狗'.substring(0, 1)).toBe('狗');

    // https://juejin.cn/post/7070079762429034526
    expect(substring('🐕‍🦺狗', 1)).toBe('🐕');
    expect('🐕‍🦺狗'.substring(0, 2)).toBe('🐕');
  });

  test('empty', () => {
    expect(substring('xxx', 0)).toBe('');
    expect(substring('', 0)).toBe('');
    expect(substring('', 10)).toBe('');

    // @ts-expect-error
    expect(substring({}, 10)).toBe('');
    // @ts-expect-error
    expect(substring(1, 10)).toBe('');
    // @ts-expect-error
    expect(substring([1], 10)).toBe('');
  });
});
