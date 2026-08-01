import type { MaybeString } from './types';

/**
 * Removes leading and trailing whitespace or specified characters from `string`.
 *
 * Nullish `str` yields `''`. Omit `chars` (or pass `undefined`) to trim
 * whitespace; `null` / `''` leave the string unchanged.
 *
 * Reference: https://radash-docs.vercel.app/docs/string/trim
 *
 * @example
 * trim('  a b c  ') // => 'a b c'
 * trim('-_-a-b-c-_-', '_-') // => 'a-b-c'
 * trim('/repos/:owner/:repo/', '/') // => 'repos/:owner/:repo'
 * trim('222222__hello__1111111', '12_') // => 'hello'
 */
export const trim = (str: MaybeString, chars?: string | null): string => {
  if (str === null || str === undefined) {
    return '';
  }

  if (chars === undefined) {
    return str.trim();
  }

  if (!chars) {
    return str;
  }

  const charsToTrim = chars.replace(/[\W]{1}/g, '\\$&');
  const regex = new RegExp(`^[${charsToTrim}]+|[${charsToTrim}]+$`, 'g');

  return str.replace(regex, '');
};

/**
 * Removes leading whitespace or specified characters from `string`.
 *
 * Nullish `str` yields `''`. Omit `chars` (or pass `undefined`) to trim
 * whitespace; `null` / `''` leave the string unchanged.
 *
 * Reference: https://radash-docs.vercel.app/docs/string/trim
 *
 * @example
 * trimStart('  a b c  ') // => 'a b c  '
 * trimStart('-_-a-b-c-_-', '_-') // => 'a-b-c-_-'
 * trimStart('/repos/:owner/:repo/', '/') // => 'repos/:owner/:repo/'
 * trimStart('222222__hello__1111111', '12_') // => 'hello__1111111'
 */
export const trimStart = (str: MaybeString, chars?: string | null): string => {
  if (str === null || str === undefined) {
    return '';
  }

  if (chars === undefined) {
    return str.trimStart();
  }

  if (!chars) {
    return str;
  }

  const charsToTrim = chars.replace(/[\W]{1}/g, '\\$&');
  const regex = new RegExp(`^[${charsToTrim}]+`, 'g');

  return str.replace(regex, '');
};

/**
 * Removes trailing whitespace or specified characters from `string`.
 *
 * Nullish `str` yields `''`. Omit `chars` (or pass `undefined`) to trim
 * whitespace; `null` / `''` leave the string unchanged.
 *
 * Reference: https://radash-docs.vercel.app/docs/string/trim
 *
 * @example
 * trimEnd('  a b c  ') // => '  a b c'
 * trimEnd('-_-a-b-c-_-', '_-') // => '-_-a-b-c'
 * trimEnd('/repos/:owner/:repo/', '/') // => '/repos/:owner/:repo'
 * trimEnd('222222__hello__1111111', '12_') // => '222222__hello'
 */
export const trimEnd = (str: MaybeString, chars?: string | null): string => {
  if (str === null || str === undefined) {
    return '';
  }

  if (chars === undefined) {
    return str.trimEnd();
  }

  if (!chars) {
    return str;
  }

  const charsToTrim = chars.replace(/[\W]{1}/g, '\\$&');
  const regex = new RegExp(`[${charsToTrim}]+$`, 'g');

  return str.replace(regex, '');
};
