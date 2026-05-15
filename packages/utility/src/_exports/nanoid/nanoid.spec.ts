import { describe, expect, test } from 'bun:test';
import { nanoid as nanoidOrigin } from 'nanoid';
import { nanoid } from './nanoid';

describe.only('nanoid', () => {
  test('nanoid/origin', () => {
    expect(nanoidOrigin().length).toBe(21);
  });

  test('nanoid/nanoid', () => {
    expect(nanoid()).not.toContain('_');

    expect(nanoid().length).toBe(21);
    expect(nanoid(10).length).toBe(10);
    expect(nanoid(32).length).toBe(32);
  });
});
