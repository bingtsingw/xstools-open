const CASE_SPLIT_PATTERN = /[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g;

/**
 * Splits `string` into an array of its words.
 *
 * Reference: https://github.com/toss/es-toolkit/blob/main/src/string/_internal/getWords.ts
 *
 * @example
 * getWords('camelCase_snake_case-kebabCase') // => ['camel', 'Case', 'snake', 'case', 'kebab', 'Case']
 * getWords('camelCaseHTTPRequest') // => ['camel', 'Case', 'HTTP', 'Request']
 * getWords('enable 24H format') // => ['enable', '24', 'H', 'format']
 * getWords('tooLegit2Quit') // => ['too', 'Legit', '2', 'Quit']
 */

export function getWords(str: string): string[] {
  return Array.from(str.match(CASE_SPLIT_PATTERN) ?? []);
}
