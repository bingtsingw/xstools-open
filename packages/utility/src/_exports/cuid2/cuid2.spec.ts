import { describe, expect, test } from 'bun:test';
import { createCuid2, cuid2, isCuid2 } from './cuid2';

describe('cuid2', () => {
  test('cuid2/isCuid2', () => {
    const cuid = cuid2();
    expect(isCuid2(cuid)).toBe(true);
    expect(cuid.length).toBe(24);

    const shortId = cuid2(6);
    expect(isCuid2(shortId)).toBe(true);
    expect(shortId.length).toBe(6);
  });

  test('createCuid2', () => {
    const fn1 = createCuid2({ length: 24 });

    expect(fn1().length).toBe(24);
    expect(fn1().length).toBe(24);

    const fn2 = createCuid2({ length: 30 });
    expect(fn2().length).toBe(30);
    expect(fn2().length).toBe(30);
  });
});
