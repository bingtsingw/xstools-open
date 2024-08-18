import { describe, expect, it } from 'bun:test';
import { isEmpty } from './isEmpty';

describe('isEmpty', () => {
  it('normal usage', () => {
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
});
