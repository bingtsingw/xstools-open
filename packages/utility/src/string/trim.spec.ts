import { describe, expect, test } from 'bun:test';
import { WHITESPACE } from '../constants';
import { trim, trimEnd, trimStart } from './trim';

describe('trim', () => {
  test('normal usage', () => {
    expect(trim('  a b c  ')).toBe('a b c');
    // TODO: add more tests from test blow to here
    // trimStart and trimEnd are similar to trim
  });

  test('should work for empty string', () => {
    expect(trim(null, '_')).toBe('');
    expect(trim('', '_')).toBe('');
    expect(trim(undefined, '_')).toBe('');
  });

  test('should work for empty chars', () => {
    const str = `${WHITESPACE}a b c${WHITESPACE}`;
    const exp = 'a b c';

    expect(trim(str)).toBe(exp);
    expect(trim(str, undefined!)).toBe(exp);

    expect(trim(str, '')).toBe(str);
    expect(trim(str, null!)).toBe(str);
  });

  test('should remove whitespace', () => {
    const str = `${WHITESPACE}a b c${WHITESPACE}`;
    const exp = 'a b c';

    expect(trim(str)).toBe(exp);
  });

  test('should remove chars', () => {
    expect(trim('  a b c  ', ' ')).toBe('a b c');
    expect(trim('-_-a-b-c-_-', '_-')).toBe('a-b-c');
    expect(trim('/repos/:owner/:repo/', '/')).toBe('repos/:owner/:repo');
    expect(trim('222222__hello__1111111', '12_')).toBe('hello');
  });
});

describe('trimStart', () => {
  test('should work for empty string', () => {
    expect(trimStart(null, '_')).toBe('');
    expect(trimStart('', '_')).toBe('');
    expect(trimStart(undefined, '_')).toBe('');
  });

  test('should work for empty chars', () => {
    const str = `${WHITESPACE}a b c${WHITESPACE}`;
    const exp = `a b c${WHITESPACE}`;

    expect(trimStart(str)).toBe(exp);
    expect(trimStart(str, undefined!)).toBe(exp);

    expect(trimStart(str, '')).toBe(str);
    expect(trimStart(str, null!)).toBe(str);
  });

  test('should remove whitespace', () => {
    const str = `${WHITESPACE}a b c${WHITESPACE}`;
    const exp = `a b c${WHITESPACE}`;

    expect(trimStart(str)).toBe(exp);
  });

  test('should remove chars', () => {
    expect(trimStart('  a b c  ', ' ')).toBe('a b c  ');
    expect(trimStart('-_-a-b-c-_-', '_-')).toBe('a-b-c-_-');
    expect(trimStart('/repos/:owner/:repo/', '/')).toBe('repos/:owner/:repo/');
    expect(trimStart('222222__hello__1111111', '12_')).toBe('hello__1111111');
  });
});

describe('trimEnd', () => {
  test('should work for empty string', () => {
    expect(trimEnd(null, '_')).toBe('');
    expect(trimEnd('', '_')).toBe('');
    expect(trimEnd(undefined, '_')).toBe('');
  });

  test('should work for empty chars', () => {
    const str = `${WHITESPACE}a b c${WHITESPACE}`;
    const exp = `${WHITESPACE}a b c`;

    expect(trimEnd(str)).toBe(exp);
    expect(trimEnd(str, undefined!)).toBe(exp);

    expect(trimEnd(str, '')).toBe(str);
    expect(trimEnd(str, null!)).toBe(str);
  });

  test('should remove whitespace', () => {
    const str = `${WHITESPACE}a b c${WHITESPACE}`;
    const exp = `${WHITESPACE}a b c`;

    expect(trimEnd(str)).toBe(exp);
  });

  test('should remove chars', () => {
    expect(trimEnd('  a b c  ', ' ')).toBe('  a b c');
    expect(trimEnd('-_-a-b-c-_-', '_-')).toBe('-_-a-b-c');
    expect(trimEnd('/repos/:owner/:repo/', '/')).toBe('/repos/:owner/:repo');
    expect(trimEnd('222222__hello__1111111', '12_')).toBe('222222__hello');
  });
});
