import type { MaybeString } from './types';

const CASE_SPLIT_PATTERN =
  /\p{Lu}?\p{Ll}+|[0-9]+|\p{Lu}+(?!\p{Ll})|\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{L}+/gu;

/**
 * Splits `string` into an array of its words, treating spaces and punctuation marks as separators.
 *
 * Nullish input yields `[]`.
 *
 * Reference: https://es-toolkit.slash.page/reference/string/words.html
 *
 * @param {MaybeString} str The string to inspect.
 * @returns {string[]} Returns the words of `string`.
 *
 * @example
 * getWords('camelCase_snake_case-kebabCase') // => ['camel', 'Case', 'snake', 'case', 'kebab', 'Case']
 * getWords('camelCaseHTTPRequest🚀') // => ['camel', 'Case', 'HTTP', 'Request', '🚀']
 * getWords('enable 24H format') // => ['enable', '24', 'H', 'format']
 * getWords('tooLegit2Quit') // => ['too', 'Legit', '2', 'Quit']
 */
export const getWords = (str: MaybeString): string[] => {
  if (str === null || str === undefined) {
    return [];
  }

  return Array.from(str.match(CASE_SPLIT_PATTERN) ?? []);
};
