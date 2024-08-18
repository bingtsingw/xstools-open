import { describe, expect, it } from 'bun:test';
import { stubArgs } from '../_internal';
import { isArguments } from './isArguments';

describe('isArguments', () => {
  it('should return `true` for `arguments` objects', () => {
    expect(isArguments(stubArgs)).toBe(true);
  });

  it('should return `false` for non `arguments` objects', () => {
    expect(isArguments(undefined)).toBe(false);
    expect(isArguments(null)).toBe(false);
    expect(isArguments(false)).toBe(false);
    expect(isArguments(0)).toBe(false);
    expect(isArguments(NaN)).toBe(false);
    expect(isArguments('')).toBe(false);
    expect(isArguments([1, 2, 3])).toBe(false);
    expect(isArguments(true)).toBe(false);
    expect(isArguments(new Date())).toBe(false);
    expect(isArguments(new Error())).toBe(false);
    expect(isArguments(Array.prototype.slice)).toBe(false);
    expect(isArguments({ 0: 1, callee: () => {}, length: 1 })).toBe(false);
    expect(isArguments(1)).toBe(false);
    expect(isArguments(/x/)).toBe(false);
    expect(isArguments('a')).toBe(false);
    expect(isArguments(Symbol(''))).toBe(false);
  });
});
