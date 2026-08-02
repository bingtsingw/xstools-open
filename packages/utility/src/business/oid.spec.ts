import { describe, expect, test } from 'bun:test';
import { oid } from './oid';

describe('oid', () => {
  test('returns 20 chars prefixed with UTC yyMMdd', () => {
    const value = oid();
    const utcPrefix = new Date().toISOString().slice(2, 10).replace(/-/g, '');

    expect(value).toStartWith(utcPrefix);
    expect(value).toHaveLength(20);
    expect(value).toMatch(/^\d{20}$/);
  });
});
