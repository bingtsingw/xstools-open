import { describe, expect, test } from 'bun:test';
import { hashParams } from './hashParams';

describe('hashParams', () => {
  test('normal usage', () => {
    const hash = '6662d0eaccfb2b58df486043241398e9abac1e9dcbad982a73e8bb2e36f9dcfe';

    expect(hashParams({ id: '1', params: { a: 1, b: 2 } })).toBe(hash);
    expect(hashParams({ id: '1', params: { b: 2, a: 1 } })).toBe(hash);
  });
});
