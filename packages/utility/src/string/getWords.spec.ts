import { describe, expect, test } from 'bun:test';
import { getWords } from './getWords';

describe('getWords', () => {
  test('nullish input', () => {
    expect(getWords(null)).toEqual([]);
    expect(getWords(undefined)).toEqual([]);
  });

  test('work with compound words', async () => {
    expect(getWords('')).toEqual([]);

    expect(getWords('camelCase')).toEqual(['camel', 'Case']);
    expect(getWords('snake_case')).toEqual(['snake', 'case']);
    expect(getWords('kebab-case')).toEqual(['kebab', 'case']);
    expect(getWords('camelCase_snake_case-kebabCase')).toEqual(['camel', 'Case', 'snake', 'case', 'kebab', 'Case']);
    expect(getWords('HTTPRequest')).toEqual(['HTTP', 'Request']);
    expect(getWords('special_characters@123')).toEqual(['special', 'characters', '123']);
    expect(getWords('  leading_and_trailing_whitespace  ')).toEqual(['leading', 'and', 'trailing', 'whitespace']);
    expect(getWords('underscore_case_example')).toEqual(['underscore', 'case', 'example']);
    expect(getWords('aB')).toEqual(['a', 'B']);
    expect(getWords('--FOO-BAR--')).toEqual(['FOO', 'BAR']);
    expect(getWords('foo2bar')).toEqual(['foo', '2', 'bar']);

    expect(getWords('12ft')).toEqual(['12', 'ft']);
    expect(getWords('aeiouAreVowels')).toEqual(['aeiou', 'Are', 'Vowels']);
    expect(getWords('enable 6h format')).toEqual(['enable', '6', 'h', 'format']);
    expect(getWords('enable 24H format')).toEqual(['enable', '24', 'H', 'format']);
    expect(getWords('split these words')).toEqual(['split', 'these', 'words']);
    expect(getWords('fred, barney, & pebbles')).toEqual(['fred', 'barney', 'pebbles']);
    expect(getWords('isISO8601')).toEqual(['is', 'ISO', '8601']);
    expect(getWords('LETTERSAeiouAreVowels')).toEqual(['LETTERS', 'Aeiou', 'Are', 'Vowels']);
    expect(getWords('tooLegit2Quit')).toEqual(['too', 'Legit', '2', 'Quit']);
    expect(getWords('walk500Miles')).toEqual(['walk', '500', 'Miles']);
    expect(getWords('xhr2Request')).toEqual(['xhr', '2', 'Request']);
    expect(getWords('XMLHttp')).toEqual(['XML', 'Http']);
    expect(getWords('XmlHTTP')).toEqual(['Xml', 'HTTP']);
    expect(getWords('XmlHttp')).toEqual(['Xml', 'Http']);

    expect(getWords('æiouAreVowels')).toEqual(['æiou', 'Are', 'Vowels']);
    expect(getWords('Lunedì 18 Set')).toEqual(['Lunedì', '18', 'Set']);
    expect(getWords('中文')).toEqual(['中文']);
    expect(getWords('example🚀with✨emojis💡and🔍special🌟characters')).toEqual([
      'example',
      '🚀',
      'with',
      '✨',
      'emojis',
      '💡',
      'and',
      '🔍',
      'special',
      '🌟',
      'characters',
    ]);
    expect(getWords('camelCaseHTTPRequest🚀')).toEqual(['camel', 'Case', 'HTTP', 'Request', '🚀']);
  });

  test('do not support', () => {
    expect(getWords("I'm I'll")).not.toEqual(["I'm", "I'll"]);
    expect(getWords('1st')).not.toEqual(['1st']);
  });
});
