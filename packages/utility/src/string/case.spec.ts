import { describe, expect, test } from 'bun:test';
import {
  capitalize,
  caseCamel,
  caseConstant,
  caseKebab,
  caseLower,
  caseLowerFirst,
  casePascal,
  caseSnake,
  caseStart,
  caseUpper,
  caseUpperFirst,
} from './case';

describe('case', () => {
  test('caseUpperFirst', () => {
    expect(caseUpperFirst(undefined)).toBe('');
    expect(caseUpperFirst(null)).toBe('');
    expect(caseUpperFirst('')).toBe('');
    expect(caseUpperFirst('f')).toBe('F');
    expect(caseUpperFirst('F')).toBe('F');
    expect(caseUpperFirst(' fred')).toEqual(' fred');
    expect(caseUpperFirst('fred')).toBe('Fred');
    expect(caseUpperFirst('FRED')).toBe('FRED');
    expect(caseUpperFirst('-fred')).toBe('-fred');
    expect(caseUpperFirst('❄fred')).toBe('❄fred');
    expect(caseUpperFirst('f❄red')).toBe('F❄red');
    expect(caseUpperFirst('𝌆fred')).toBe('𝌆fred');
    expect(caseUpperFirst('f𝌆red')).toBe('F𝌆red');
    expect(caseUpperFirst('中fred')).toBe('中fred');
    expect(caseUpperFirst('f中red')).toBe('F中red');
  });

  test('caseLowerFirst', () => {
    expect(caseLowerFirst(undefined)).toBe('');
    expect(caseLowerFirst(null)).toBe('');
    expect(caseLowerFirst('')).toBe('');
    expect(caseLowerFirst('f')).toBe('f');
    expect(caseLowerFirst('F')).toBe('f');
    expect(caseLowerFirst(' fred')).toEqual(' fred');
    expect(caseLowerFirst('fred')).toBe('fred');
    expect(caseLowerFirst('FRED')).toBe('fRED');
    expect(caseLowerFirst('-fred')).toBe('-fred');
    expect(caseLowerFirst('❄fred')).toBe('❄fred');
    expect(caseLowerFirst('F❄red')).toBe('f❄red');
    expect(caseLowerFirst('𝌆fred')).toBe('𝌆fred');
    expect(caseLowerFirst('F𝌆red')).toBe('f𝌆red');
    expect(caseLowerFirst('中fred')).toBe('中fred');
    expect(caseLowerFirst('F中red')).toBe('f中red');
  });

  test('capitalize', () => {
    expect(capitalize(undefined)).toBe('');
    expect(capitalize(null)).toBe('');
    expect(capitalize('')).toBe('');
    expect(capitalize('f')).toBe('F');
    expect(capitalize('F')).toBe('F');
    expect(capitalize(' fred')).toEqual(' fred');
    expect(capitalize('fred')).toBe('Fred');
    expect(capitalize('FRED')).toBe('Fred');
    expect(capitalize('-fred')).toBe('-fred');
    expect(capitalize('❄fred')).toBe('❄fred');
    expect(capitalize('f❄red')).toBe('F❄red');
    expect(capitalize('𝌆fred')).toBe('𝌆fred');
    expect(capitalize('f𝌆red')).toBe('F𝌆red');
    expect(capitalize('中fred')).toBe('中fred');
    expect(capitalize('f中red')).toBe('F中red');
    expect(capitalize('special@characters!')).toEqual('Special@characters!');
    expect(capitalize('hyphen-text')).toEqual('Hyphen-text');
  });

  test('caseLower', () => {
    expect(caseLower(undefined)).toBe('');
    expect(caseLower(null)).toBe('');
    expect(caseLower('')).toBe('');
    expect(caseLower('--foo-bar--')).toBe('foo bar');
    expect(caseLower('fooBar')).toBe('foo bar');
    expect(caseLower('__FOO_BAR__')).toBe('foo bar');
    expect(caseLower('XMLHttpRequest')).toBe('xml http request');
    expect(caseLower('_abc_123_def')).toBe('abc 123 def');
    expect(caseLower('__abc__123__def__')).toBe('abc 123 def');
    expect(caseLower('_-_-_-_')).toBe('');
    expect(caseLower('12abc 12ABC')).toBe('12 abc 12 abc');
    expect(caseLower('❄Fred')).toBe('❄ fred');
    expect(caseLower('𝌆Fred')).toBe('fred'); // TODO
    expect(caseLower('中Fred')).toBe('中fred'); // TODO
    expect(caseLower('special@characters!')).toEqual('special characters');
  });

  test('caseUpper', () => {
    expect(caseUpper(undefined)).toBe('');
    expect(caseUpper(null)).toBe('');
    expect(caseUpper('')).toBe('');
    expect(caseUpper('--foo-bar--')).toBe('FOO BAR');
    expect(caseUpper('fooBar')).toBe('FOO BAR');
    expect(caseUpper('__FOO_BAR__')).toBe('FOO BAR');
    expect(caseUpper('XMLHttpRequest')).toBe('XML HTTP REQUEST');
    expect(caseUpper('_abc_123_def')).toBe('ABC 123 DEF');
    expect(caseUpper('__abc__123__def__')).toBe('ABC 123 DEF');
    expect(caseUpper('_-_-_-_')).toBe('');
    expect(caseUpper('12abc 12ABC')).toBe('12 ABC 12 ABC');
    expect(caseUpper('❄Fred')).toBe('❄ FRED');
    expect(caseUpper('𝌆Fred')).toBe('FRED'); // TODO
    expect(caseUpper('中Fred')).toBe('中FRED'); // TODO
  });

  test('caseStart', () => {
    expect(caseStart(undefined)).toBe('');
    expect(caseStart(null)).toBe('');
    expect(caseStart('')).toBe('');
    expect(caseStart('--foo-bar--')).toBe('Foo Bar');
    expect(caseStart('fooBar')).toBe('Foo Bar');
    expect(caseStart('__FOO_BAR__')).toBe('Foo Bar');
    expect(caseStart('XMLHttpRequest')).toBe('Xml Http Request');
    expect(caseStart('_abc_123_def')).toBe('Abc 123 Def');
    expect(caseStart('__abc__123__def__')).toBe('Abc 123 Def');
    expect(caseStart('ABC-DEF')).toBe('Abc Def');
    expect(caseStart('ABC DEF')).toBe('Abc Def');
    expect(caseStart('_-_-_-_')).toBe('');
    expect(caseStart('12abc 12ABC')).toBe('12 Abc 12 Abc');
    expect(caseStart('123ABC')).toBe('123 Abc');
    expect(caseStart('a1B2c3')).toBe('A 1 B 2 C 3');
    expect(caseStart('ABC')).toBe('Abc');
    expect(caseStart('ABCdef')).toBe('Ab Cdef');
    expect(caseStart('foo@bar')).toBe('Foo Bar');
    expect(caseStart('test*case')).toBe('Test Case');
    expect(caseStart('thisIsAVeryLongStringWithManyWordsAndNumbers123')).toBe(
      'This Is A Very Long String With Many Words And Numbers 123',
    );
    expect(caseStart('  foo  bar  ')).toBe('Foo Bar');
    expect(caseStart('\tfoo\nbar')).toBe('Foo Bar');
    expect(caseStart('lunedì 18 set')).toBe('Lunedì 18 Set');
    expect(caseStart('Keep unicode 😅')).toEqual('Keep Unicode 😅');
  });

  test('caseSnake', () => {
    expect(caseSnake(undefined)).toBe('');
    expect(caseSnake(null)).toBe('');
    expect(caseSnake('')).toBe('');
    expect(caseSnake('--foo-bar--')).toBe('foo_bar');
    expect(caseSnake('fooBar')).toBe('foo_bar');
    expect(caseSnake('__FOO_BAR__')).toBe('foo_bar');
    expect(caseSnake('XMLHttpRequest')).toBe('xml_http_request');
    expect(caseSnake('_abc_123_def')).toBe('abc_123_def');
    expect(caseSnake('__abc__123__def__')).toBe('abc_123_def');
    expect(caseSnake('_-_-_-_')).toBe('');
    expect(caseSnake('12abc 12ABC')).toBe('12_abc_12_abc');
    expect(caseSnake('foo@bar')).toBe('foo_bar');
    expect(caseSnake('test*case')).toBe('test_case');
    expect(caseSnake('Keep unicode 😅')).toEqual('keep_unicode_😅');
  });

  test('caseKebab', () => {
    expect(caseKebab(undefined)).toBe('');
    expect(caseKebab(null)).toBe('');
    expect(caseKebab('')).toBe('');
    expect(caseKebab('--foo-bar--')).toBe('foo-bar');
    expect(caseKebab('fooBar')).toBe('foo-bar');
    expect(caseKebab('__FOO_BAR__')).toBe('foo-bar');
    expect(caseKebab('XMLHttpRequest')).toBe('xml-http-request');
    expect(caseKebab('_abc_123_def')).toBe('abc-123-def');
    expect(caseKebab('__abc__123__def__')).toBe('abc-123-def');
    expect(caseKebab('_-_-_-_')).toBe('');
    expect(caseKebab('12abc 12ABC')).toBe('12-abc-12-abc');
    expect(caseKebab('foo@bar')).toBe('foo-bar');
    expect(caseKebab('test*case')).toBe('test-case');
    expect(caseKebab('Keep unicode 😅')).toEqual('keep-unicode-😅');
  });

  test('casePascal', () => {
    expect(casePascal(undefined)).toBe('');
    expect(casePascal(null)).toBe('');
    expect(casePascal('')).toBe('');
    expect(casePascal('--foo-bar--')).toBe('FooBar');
    expect(casePascal('fooBar')).toBe('FooBar');
    expect(casePascal('__FOO_BAR__')).toBe('FooBar');
    expect(casePascal('XMLHttpRequest')).toBe('XmlHttpRequest');
    expect(casePascal('_abc_123_def')).toBe('Abc123Def');
    expect(casePascal('__abc__123__def__')).toBe('Abc123Def');
    expect(casePascal('_-_-_-_')).toBe('');
    expect(casePascal('12abc 12ABC')).toBe('12Abc12Abc');
    expect(casePascal('foo@bar')).toBe('FooBar');
    expect(casePascal('test*case')).toBe('TestCase');
    expect(casePascal('Keep unicode 😅')).toEqual('KeepUnicode😅');
  });

  test('caseCamel', () => {
    expect(caseCamel(undefined)).toBe('');
    expect(caseCamel(null)).toBe('');
    expect(caseCamel('')).toBe('');
    expect(caseCamel('--foo-bar--')).toBe('fooBar');
    expect(caseCamel('fooBar')).toBe('fooBar');
    expect(caseCamel('__FOO_BAR__')).toBe('fooBar');
    expect(caseCamel('XMLHttpRequest')).toBe('xmlHttpRequest');
    expect(caseCamel('_abc_123_def')).toBe('abc123Def');
    expect(caseCamel('__abc__123__def__')).toBe('abc123Def');
    expect(caseCamel('_-_-_-_')).toBe('');
    expect(caseCamel('12abc 12ABC')).toBe('12Abc12Abc');
    expect(caseCamel('foo@bar')).toBe('fooBar');
    expect(caseCamel('test*case')).toBe('testCase');
    expect(caseCamel('Keep unicode 😅')).toEqual('keepUnicode😅');
  });

  test('caseConstant', () => {
    expect(caseConstant(undefined)).toBe('');
    expect(caseConstant(null)).toBe('');
    expect(caseConstant('')).toBe('');
    expect(caseConstant('--foo-bar--')).toBe('FOO_BAR');
    expect(caseConstant('fooBar')).toBe('FOO_BAR');
    expect(caseConstant('__FOO_BAR__')).toBe('FOO_BAR');
    expect(caseConstant('XMLHttpRequest')).toBe('XML_HTTP_REQUEST');
    expect(caseConstant('_abc_123_def')).toBe('ABC_123_DEF');
    expect(caseConstant('__abc__123__def__')).toBe('ABC_123_DEF');
    expect(caseConstant('_-_-_-_')).toBe('');
    expect(caseConstant('12abc 12ABC')).toBe('12_ABC_12_ABC');
    expect(caseConstant('foo@bar')).toBe('FOO_BAR');
    expect(caseConstant('test*case')).toBe('TEST_CASE');
    expect(caseConstant('Keep unicode 😅')).toEqual('KEEP_UNICODE_😅');
  });
});
