import { describe, expect, test } from 'bun:test';
import { getTag } from './getTag';

describe('getTag', () => {
  test('should return the tag of the value', () => {
    expect(getTag(null)).toBe('[object Null]');
    expect(getTag(undefined)).toBe('[object Undefined]');
    expect(getTag(1)).toBe('[object Number]');
    expect(getTag('')).toBe('[object String]');
    expect(getTag(true)).toBe('[object Boolean]');
    expect(getTag(Symbol(''))).toBe('[object Symbol]');
    expect(getTag(new Map())).toBe('[object Map]');
    expect(getTag(new WeakMap())).toBe('[object WeakMap]');
    expect(getTag(new Set())).toBe('[object Set]');
    expect(getTag([])).toBe('[object Array]');
    expect(getTag({})).toBe('[object Object]');
    expect(getTag(() => {})).toBe('[object Function]');
    expect(getTag(new Date())).toBe('[object Date]');
    expect(getTag(/./)).toBe('[object RegExp]');
  });

  test('should return the tag of the custom object', () => {
    class Custom {}
    expect(getTag(new Custom())).toBe('[object Object]');
  });
});
