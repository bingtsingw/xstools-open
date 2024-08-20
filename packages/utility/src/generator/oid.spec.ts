import { describe, expect, test } from 'bun:test';
import { oid } from './oid';

describe('oid', () => {
  test('normal usage', () => {
    // TODO: more test cases
    const _oid = oid();

    expect(_oid.length).toEqual(20);
  });
});
