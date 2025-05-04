/**
 * Removes leading and trailing whitespace or specified characters from `string`.
 *
 * Reference: https://radash-docs.vercel.app/docs/string/trim
 *
 * @example
 * trim('  a b c  ') // => 'a b c'
 * trim('-_-a-b-c-_-', '_-') // => 'a-b-c'
 * trim('/repos/:owner/:repo/', '/') // => 'repos/:owner/:repo'
 * trim('222222__hello__1111111', '12_') // => 'hello'
 */
export const trim = (str: string | null | undefined, chars?: string): string => {
  if (str && chars === undefined) {
    return str.trim();
  }

  if (!str || !chars) {
    return str || '';
  }

  const charsToTrim = chars.replace(/[\W]{1}/g, '\\$&');
  const regex = new RegExp(`^[${charsToTrim}]+|[${charsToTrim}]+$`, 'g');

  return str.replace(regex, '');
};

/**
 * Removes leading whitespace or specified characters from `string`.
 *
 * Reference: https://radash-docs.vercel.app/docs/string/trim
 *
 * @example
 * trim('  a b c  ') // => 'a b c  '
 * trim('-_-a-b-c-_-', '_-') // => 'a-b-c-_-'
 * trim('/repos/:owner/:repo/', '/') // => 'repos/:owner/:repo/'
 * trim('222222__hello__1111111', '12_') // => 'hello__1111111'
 */
export const trimStart = (str: string | null | undefined, chars?: string): string => {
  if (str && chars === undefined) {
    return str.trimStart();
  }

  if (!str || !chars) {
    return str || '';
  }

  const charsToTrim = chars.replace(/[\W]{1}/g, '\\$&');
  const regex = new RegExp(`^[${charsToTrim}]+`, 'g');

  return str.replace(regex, '');
};

/**
 * Removes trailing whitespace or specified characters from `string`.
 *
 * Reference: https://radash-docs.vercel.app/docs/string/trim
 *
 * @example
 * trim('  a b c  ') // => '  a b c'
 * trim('-_-a-b-c-_-', '_-') // => '-_-a-b-c'
 * trim('/repos/:owner/:repo/', '/') // => '/repos/:owner/:repo'
 * trim('222222__hello__1111111', '12_') // => '222222__hello'
 */
export const trimEnd = (str: string | null | undefined, chars?: string): string => {
  if (str && chars === undefined) {
    return str.trimEnd();
  }

  if (!str || !chars) {
    return str || '';
  }

  const charsToTrim = chars.replace(/[\W]{1}/g, '\\$&');
  const regex = new RegExp(`[${charsToTrim}]+$`, 'g');

  return str.replace(regex, '');
};
