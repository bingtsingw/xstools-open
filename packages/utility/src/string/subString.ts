import { ParamError } from '../error';
import type { MaybeString } from './types';

/**
 * Returns a prefix of the string by Unicode code point length.
 *
 * Nullish input yields `''`. Non-string values throw `ParamError`.
 *
 * This is safer than native `String#substring` for common emoji (which may be
 * surrogate pairs), but it does not guarantee grapheme clusters (e.g. ZWJ
 * sequences may still be split).
 *
 * @example
 * subString('123', 2) // => '12'
 * subString('123', 10) // => '123'
 * subString('今天很开心🌸🌸🌸', 6) // => '今天很开心🌸'
 *
 * --- WHY NOT NATIVE ---
 * '今天很开心🌸🌸🌸'.substring(0, 6) // => '今天很开心\ud83c'
 * '今天很开心🌸🌸🌸'.substring(0, 7) // => '今天很开心🌸'
 */
export const subString = (s: MaybeString, length: number): string => {
  if (s === null || s === undefined) {
    return '';
  }

  if (typeof s !== 'string') {
    throw new ParamError('Expected string');
  }

  return [...s].slice(0, length).join('');
};
