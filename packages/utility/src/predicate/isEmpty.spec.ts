import { describe, expect, test } from 'bun:test';
import { stubArgs } from '../_internal';
import { isEmpty } from './isEmpty';

describe('isEmpty', () => {
  test('normal usage', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);

    expect(isEmpty(NaN)).toBe(false);
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty('0')).toBe(false);
    expect(isEmpty([0])).toBe(false);
    expect(isEmpty({ length: 0 })).toBe(false);
  });

  test('Map and Set', () => {
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(new Map([['a', 1]]))).toBe(false);
    expect(isEmpty(new Set([1]))).toBe(false);
  });

  test('Date, function, and arguments', () => {
    expect(isEmpty(new Date())).toBe(true);
    expect(isEmpty(() => {})).toBe(false);
    expect(isEmpty(stubArgs)).toBe(false);

    const emptyArgs = (function () {
      return arguments;
    })();
    expect(isEmpty(emptyArgs)).toBe(true);
  });
});
