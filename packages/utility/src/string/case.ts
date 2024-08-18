import { getWords } from './getWords';

/**
 * Converts the first character of string to upper case.
 *
 * References: https://github.com/lodash/lodash/blob/main/src/upperFirst.ts
 *
 * @example
 * caseUpperFirst('fred') // => 'Fred'
 * caseUpperFirst('FRED') // => 'FRED'
 */
export const caseUpperFirst = (str: string): string => {
  if (!str) {
    return '';
  }

  const [first, ...rest] = str;
  return first!.toUpperCase() + rest.join('');
};

/**
 * Converts the first character of string to lower case.
 *
 * References: https://github.com/lodash/lodash/blob/main/src/lowerFirst.ts
 *
 * @example
 * caseLowerFirst('fred') // => 'fred'
 * caseLowerFirst('FRED') // => 'fRED'
 */
export const caseLowerFirst = (str: string): string => {
  if (!str) {
    return '';
  }

  const [first, ...rest] = str;
  return first!.toLowerCase() + rest.join('');
};

/**
 * Converts the first character of string to upper case and the remaining to lower case.
 *
 * References: https://github.com/lodash/lodash/blob/main/src/capitalize.ts
 *
 * @example
 * capitalize('fred') // => 'Fred'
 * capitalize('FRED') // => 'Fred'
 */
export const capitalize = (str: string): string => {
  if (!str) {
    return '';
  }

  return caseUpperFirst(str.toLowerCase());
};

/**
 * Converts string, as space separated words, to lower case.
 *
 * References: https://github.com/lodash/lodash/blob/main/src/lowerCase.ts
 *
 * @example
 * caseLower('--foo-bar--') // => 'foo bar'
 * caseLower('fooBar') // => 'foo bar'
 * caseLower('__FOO_BAR__') // => 'foo bar'
 */
export const caseLower = (str: string): string => {
  return getWords(str).reduce((result, word, index) => result + (index ? ' ' : '') + word.toLowerCase(), '');
};

/**
 * Converts string, as space separated words, to upper case.
 *
 * References: https://github.com/lodash/lodash/blob/main/src/upperCase.ts
 *
 * @example
 * caseUpper('--foo-bar--') // => 'FOO BAR'
 * caseUpper('fooBar') // => 'FOO BAR'
 * caseUpper('__FOO_BAR__') // => 'FOO BAR'
 */
export const caseUpper = (str: string): string => {
  return getWords(str).reduce((result, word, index) => result + (index ? ' ' : '') + word.toUpperCase(), '');
};

/**
 * Converts string to start case.
 *
 * References: https://github.com/lodash/lodash/blob/main/src/startCase.ts
 *
 * @example
 * caseStart('--foo-bar--') // => 'Foo Bar'
 * caseStart('fooBar') // => 'Foo Bar'
 * caseStart('__FOO_BAR__') // => 'FOO BAR'
 */
export const caseStart = (str: string): string => {
  return getWords(str).reduce((result, word, index) => result + (index ? ' ' : '') + caseUpperFirst(word), '');
};

/**
 * Converts string to snake case.
 *
 * References: https://github.com/lodash/lodash/blob/main/src/snakeCase.ts
 *
 * @example
 * caseSnake('--foo-bar--') // => 'foo_bar'
 * caseSnake('fooBar') // => 'foo_bar'
 * caseSnake('__FOO_BAR__') // => 'foo_bar'
 */
export const caseSnake = (str: string): string => {
  return getWords(str).reduce((result, word, index) => result + (index ? '_' : '') + word.toLowerCase(), '');
};

/**
 * Converts string to kebab case.
 *
 * References: https://github.com/lodash/lodash/blob/main/src/kebabCase.ts
 *
 * @example
 * caseKebab('--foo-bar--') // => 'foo-bar'
 * caseKebab('fooBar') // => 'foo-bar'
 * caseKebab('__FOO_BAR__') // => 'foo-bar'
 */
export const caseKebab = (str: string): string => {
  return getWords(str).reduce((result, word, index) => result + (index ? '-' : '') + word.toLowerCase(), '');
};

/**
 * Converts string to pascal case.
 *
 * References: https://github.com/lodash/lodash/blob/main/src/camelCase.ts
 *
 * @example
 * casePascal('--foo-bar--') // => 'FooBar'
 * casePascal('fooBar') // => 'FooBar'
 * casePascal('__FOO_BAR__') // => 'FooBar'
 */
export const casePascal = (str: string): string => {
  return getWords(str).reduce((result, word) => result + capitalize(word), '');
};

/**
 * Converts string to camel case.
 *
 * References: https://github.com/lodash/lodash/blob/main/src/camelCase.ts
 *
 * @example
 * caseCamel('--foo-bar--') // => 'fooBar'
 * caseCamel('fooBar') // => 'fooBar'
 * caseCamel('__FOO_BAR__') // => 'fooBar'
 */
export const caseCamel = (str: string): string => {
  return getWords(str).reduce((result, word, index) => result + (index ? capitalize(word) : word.toLowerCase()), '');
};
