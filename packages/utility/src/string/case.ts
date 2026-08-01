import { getWords } from './getWords';
import type { MaybeString } from './types';

/**
 * Converts the first character of string to upper case.
 *
 * References: https://es-toolkit.slash.page/reference/string/upperFirst.html
 *
 * @param {MaybeString} str - The string that is to be changed
 * @returns {string} - The converted string. Nullish input yields `''`.
 *
 * @example
 * caseUpperFirst('fred') // => 'Fred'
 * caseUpperFirst('FRED') // => 'FRED'
 */
export const caseUpperFirst = (str: MaybeString): string => {
  if (str === null || str === undefined) {
    return '';
  }

  return str.substring(0, 1).toUpperCase() + str.substring(1);
};

/**
 * Converts the first character of string to lower case.
 *
 * References: https://es-toolkit.slash.page/reference/string/lowerFirst.html
 *
 * @param {MaybeString} str - The string that is to be changed
 * @returns {string} - The converted string. Nullish input yields `''`.
 *
 * @example
 * caseLowerFirst('fred') // => 'fred'
 * caseLowerFirst('FRED') // => 'fRED'
 */
export const caseLowerFirst = (str: MaybeString): string => {
  if (str === null || str === undefined) {
    return '';
  }

  return str.substring(0, 1).toLowerCase() + str.substring(1);
};

/**
 * Converts the first character of string to upper case and the remaining to lower case.
 *
 * References: https://es-toolkit.slash.page/reference/string/capitalize.html
 *
 * @template T - Literal type of the string.
 * @param {T | null | undefined} str - The string to be converted to uppercase.
 * @returns {Capitalize<T>} - The capitalized string. Nullish input yields `''`.
 *
 * @example
 * capitalize('fred') // => 'Fred'
 * capitalize('FRED') // => 'Fred'
 */
export const capitalize = <T extends string>(str: T | null | undefined): Capitalize<T> => {
  if (str === null || str === undefined) {
    return '' as Capitalize<T>;
  }

  return caseUpperFirst(str.toLowerCase()) as Capitalize<T>;
};
type Capitalize<T extends string> = T extends `${infer F}${infer R}` ? `${Uppercase<F>}${Lowercase<R>}` : T;

/**
 * Converts string, as space separated words, to lower case.
 *
 * References: https://es-toolkit.slash.page/reference/string/lowerCase.html
 *
 * @param {MaybeString} str - The string that is to be changed to lower case.
 * @returns {string} - The converted string to lower case. Nullish input yields `''`.
 *
 * @example
 * caseLower('--foo-bar--') // => 'foo bar'
 * caseLower('fooBar') // => 'foo bar'
 * caseLower('__FOO_BAR__') // => 'foo bar'
 * caseLower('XMLHttpRequest') // => 'xml http request'
 */
export const caseLower = (str: MaybeString): string => {
  if (str === null || str === undefined) {
    return '';
  }

  return getWords(str)
    .map((word) => word.toLowerCase())
    .join(' ');
};

/**
 * Converts string, as space separated words, to upper case.
 *
 * References: https://es-toolkit.slash.page/reference/string/upperCase.html
 *
 * @param {MaybeString} str - The string that is to be changed to upper case.
 * @returns {string} - The converted string to upper case. Nullish input yields `''`.
 *
 * @example
 * caseUpper('--foo-bar--') // => 'FOO BAR'
 * caseUpper('fooBar') // => 'FOO BAR'
 * caseUpper('__FOO_BAR__') // => 'FOO BAR'
 * caseUpper('XMLHttpRequest') // => 'XML HTTP REQUEST'
 */
export const caseUpper = (str: MaybeString): string => {
  if (str === null || str === undefined) {
    return '';
  }

  return getWords(str)
    .map((word) => word.toUpperCase())
    .join(' ');
};

/**
 * Converts the first character of each word in a string to uppercase and the remaining characters to lowercase.
 *
 * References: https://es-toolkit.slash.page/reference/string/startCase.html
 *
 * @param {MaybeString} str - The string to convert.
 * @returns {string} The converted string. Nullish input yields `''`.
 *
 * @example
 * caseStart('--foo-bar--') // => 'Foo Bar'
 * caseStart('fooBar') // => 'Foo Bar'
 * caseStart('__FOO_BAR__') // => 'Foo Bar'
 */
export const caseStart = (str: MaybeString): string => {
  if (str === null || str === undefined) {
    return '';
  }

  return getWords(str)
    .map((word) => capitalize(word))
    .join(' ');
};

/**
 * Converts string to snake case.
 *
 * References: https://es-toolkit.slash.page/reference/string/snakeCase.html
 *
 * @param {MaybeString} str - The string that is to be changed to snake case.
 * @returns {string} - The converted string to snake case. Nullish input yields `''`.
 *
 * @example
 * caseSnake('--foo-bar--') // => 'foo_bar'
 * caseSnake('fooBar') // => 'foo_bar'
 * caseSnake('__FOO_BAR__') // => 'foo_bar'
 */
export const caseSnake = (str: MaybeString): string => {
  if (str === null || str === undefined) {
    return '';
  }

  return getWords(str)
    .map((word) => word.toLowerCase())
    .join('_');
};

/**
 * Converts string to kebab case.
 *
 * References: https://es-toolkit.slash.page/reference/string/kebabCase.html
 *
 * @param {MaybeString} str - The string that is to be changed to kebab case.
 * @returns {string} - The converted string to kebab case. Nullish input yields `''`.
 *
 * @example
 * caseKebab('--foo-bar--') // => 'foo-bar'
 * caseKebab('fooBar') // => 'foo-bar'
 * caseKebab('__FOO_BAR__') // => 'foo-bar'
 */
export const caseKebab = (str: MaybeString): string => {
  if (str === null || str === undefined) {
    return '';
  }

  return getWords(str)
    .map((word) => word.toLowerCase())
    .join('-');
};

/**
 * Converts string to pascal case.
 *
 * References: https://es-toolkit.slash.page/reference/string/pascalCase.html
 *
 * @param {MaybeString} str - The string that is to be changed to pascal case.
 * @returns {string} - The converted string to Pascal case. Nullish input yields `''`.
 *
 * @example
 * casePascal('--foo-bar--') // => 'FooBar'
 * casePascal('fooBar') // => 'FooBar'
 * casePascal('__FOO_BAR__') // => 'FooBar'
 */
export const casePascal = (str: MaybeString): string => {
  if (str === null || str === undefined) {
    return '';
  }

  return getWords(str)
    .map((word) => capitalize(word))
    .join('');
};

/**
 * Converts string to camel case.
 *
 * References: https://es-toolkit.slash.page/reference/string/camelCase.html
 *
 * @param {MaybeString} str - The string that is to be changed to camel case.
 * @returns {string} - The converted string to camel case. Nullish input yields `''`.
 *
 * @example
 * caseCamel('--foo-bar--') // => 'fooBar'
 * caseCamel('fooBar') // => 'fooBar'
 * caseCamel('__FOO_BAR__') // => 'fooBar'
 */
export const caseCamel = (str: MaybeString): string => {
  if (str === null || str === undefined) {
    return '';
  }

  return getWords(str)
    .map((word, index) => (index ? capitalize(word) : word.toLowerCase()))
    .join('');
};

/**
 * Converts a string to constant case.
 *
 * References: https://es-toolkit.slash.page/reference/string/constantCase.html
 *
 * @param {MaybeString} str - The string that is to be changed to constant case.
 * @returns {string} - The converted string to constant case. Nullish input yields `''`.
 *
 * @example
 * caseConstant('--foo-bar--') // => 'FOO_BAR'
 * caseConstant('fooBar') // => 'FOO_BAR'
 * caseConstant('__FOO_BAR__') // => 'FOO_BAR'
 */
export const caseConstant = (str: MaybeString): string => {
  if (str === null || str === undefined) {
    return '';
  }

  return getWords(str)
    .map((word) => word.toUpperCase())
    .join('_');
};
