import type { MaybeString } from './types';

/**
 * template is used to replace data by name in template strings.
 *
 * Nullish `str` yields `''`. Missing keys and `null` / `undefined` values become
 * an empty string. Falsy values like `0` or `false` are preserved.
 *
 * Reference: https://radash-docs.vercel.app/docs/string/template
 *
 * @example
 * template('Hello, {{ name }}', { name: 'ray' }) // => Hello, ray
 * template('Hello, {{ name }}', {age: 1}) // => Hello,
 * template('count={{ count }}', { count: 0 }) // => count=0
 */
export const template = (str: MaybeString, data: Record<string, unknown>): string => {
  if (str === null || str === undefined) {
    return '';
  }

  const regex = /\{\{\s*(.+?)\s*\}\}/g;

  // Use a replacement function so `$`-sequences in values (e.g. `$&`, `$$`)
  // are inserted literally instead of being treated as replacement patterns.
  return str.replace(regex, (_match, key: string) => {
    const value = data[key];
    return value === null || value === undefined ? '' : String(value);
  });
};
