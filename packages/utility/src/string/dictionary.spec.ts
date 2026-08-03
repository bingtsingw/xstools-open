import { describe, expect, test } from 'bun:test';
import {
  DIC_ALPHANUMERIC,
  DIC_HEXADECIMAL_LOWERCASE,
  DIC_HEXADECIMAL_UPPERCASE,
  DIC_LOWERCASE,
  DIC_NUMBERS,
  DIC_UPPERCASE,
} from './dictionary';

describe('dictionary', () => {
  test('character-set constants', () => {
    expect(DIC_UPPERCASE).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    expect(DIC_LOWERCASE).toBe('abcdefghijklmnopqrstuvwxyz');
    expect(DIC_NUMBERS).toBe('0123456789');
    expect(DIC_ALPHANUMERIC).toBe(DIC_NUMBERS + DIC_LOWERCASE + DIC_UPPERCASE);
    expect(DIC_ALPHANUMERIC).toHaveLength(62);
    expect(DIC_HEXADECIMAL_UPPERCASE).toBe('0123456789ABCDEF');
    expect(DIC_HEXADECIMAL_LOWERCASE).toBe('0123456789abcdef');
  });
});
