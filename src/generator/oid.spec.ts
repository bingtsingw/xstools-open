import { describe, expect, test } from 'bun:test';
import { oid } from './oid';

describe('generator', () => {
  test('oid', () => {
    const _oid = oid();

    expect(_oid.length).toEqual(20);
  });
});
