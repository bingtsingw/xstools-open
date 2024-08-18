import { describe, expect, test } from 'bun:test';
import {
  capitalize,
  caseCamel,
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
    expect(caseUpperFirst(undefined!)).toBe('');
    expect(caseUpperFirst(null!)).toBe('');
    expect(caseUpperFirst('')).toBe('');
    expect(caseUpperFirst('f')).toBe('F');
    expect(caseUpperFirst('F')).toBe('F');
    expect(caseUpperFirst('fred')).toBe('Fred');
    expect(caseUpperFirst('FRED')).toBe('FRED');
    expect(caseUpperFirst('-fred')).toBe('-fred');
    expect(caseUpperFirst('❄fred')).toBe('❄fred');
    expect(caseUpperFirst('𝌆fred')).toBe('𝌆fred');
    expect(caseUpperFirst('中fred')).toBe('中fred');
  });

  test('caseLowerFirst', () => {
    expect(caseLowerFirst(undefined!)).toBe('');
    expect(caseLowerFirst(null!)).toBe('');
    expect(caseLowerFirst('')).toBe('');
    expect(caseLowerFirst('f')).toBe('f');
    expect(caseLowerFirst('F')).toBe('f');
    expect(caseLowerFirst('fred')).toBe('fred');
    expect(caseLowerFirst('FRED')).toBe('fRED');
    expect(caseLowerFirst('-fred')).toBe('-fred');
    expect(caseLowerFirst('❄fred')).toBe('❄fred');
    expect(caseLowerFirst('𝌆fred')).toBe('𝌆fred');
    expect(caseLowerFirst('中fred')).toBe('中fred');
  });

  test('capitalize', () => {
    expect(capitalize(undefined!)).toBe('');
    expect(capitalize(null!)).toBe('');
    expect(capitalize('')).toBe('');
    expect(capitalize('f')).toBe('F');
    expect(capitalize('F')).toBe('F');
    expect(capitalize('fred')).toBe('Fred');
    expect(capitalize('FRED')).toBe('Fred');
    expect(capitalize('-fred')).toBe('-fred');
    expect(capitalize('❄fred')).toBe('❄fred');
    expect(capitalize('𝌆fred')).toBe('𝌆fred');
    expect(capitalize('中fred')).toBe('中fred');
  });

  test('caseLower', () => {
    expect(caseLower('--foo-bar--')).toBe('foo bar');
    expect(caseLower('fooBar')).toBe('foo bar');
    expect(caseLower('__FOO_BAR__')).toBe('foo bar');
    expect(caseLower('XMLHttpRequest')).toBe('xml http request');
    expect(caseLower('_abc_123_def')).toBe('abc 123 def');
    expect(caseLower('__abc__123__def__')).toBe('abc 123 def');
    expect(caseLower('_-_-_-_')).toBe('');
    expect(caseLower('12abc 12ABC')).toBe('12 abc 12 abc');
  });

  test('caseUpper', () => {
    expect(caseUpper('--foo-bar--')).toBe('FOO BAR');
    expect(caseUpper('fooBar')).toBe('FOO BAR');
    expect(caseUpper('__FOO_BAR__')).toBe('FOO BAR');
    expect(caseUpper('XMLHttpRequest')).toBe('XML HTTP REQUEST');
    expect(caseUpper('_abc_123_def')).toBe('ABC 123 DEF');
    expect(caseUpper('__abc__123__def__')).toBe('ABC 123 DEF');
    expect(caseUpper('_-_-_-_')).toBe('');
    expect(caseUpper('12abc 12ABC')).toBe('12 ABC 12 ABC');
  });

  test('caseStart', () => {
    expect(caseStart('--foo-bar--')).toBe('Foo Bar');
    expect(caseStart('fooBar')).toBe('Foo Bar');
    expect(caseStart('__FOO_BAR__')).toBe('FOO BAR');
    expect(caseStart('XMLHttpRequest')).toBe('XML Http Request');
    expect(caseStart('_abc_123_def')).toBe('Abc 123 Def');
    expect(caseStart('__abc__123__def__')).toBe('Abc 123 Def');
    expect(caseStart('_-_-_-_')).toBe('');
    expect(caseStart('12abc 12ABC')).toBe('12 Abc 12 ABC');
  });

  test('caseSnake', () => {
    expect(caseSnake('--foo-bar--')).toBe('foo_bar');
    expect(caseSnake('fooBar')).toBe('foo_bar');
    expect(caseSnake('__FOO_BAR__')).toBe('foo_bar');
    expect(caseSnake('XMLHttpRequest')).toBe('xml_http_request');
    expect(caseSnake('_abc_123_def')).toBe('abc_123_def');
    expect(caseSnake('__abc__123__def__')).toBe('abc_123_def');
    expect(caseSnake('_-_-_-_')).toBe('');
    expect(caseSnake('12abc 12ABC')).toBe('12_abc_12_abc');
  });

  test('caseKebab', () => {
    expect(caseKebab('--foo-bar--')).toBe('foo-bar');
    expect(caseKebab('fooBar')).toBe('foo-bar');
    expect(caseKebab('__FOO_BAR__')).toBe('foo-bar');
    expect(caseKebab('XMLHttpRequest')).toBe('xml-http-request');
    expect(caseKebab('_abc_123_def')).toBe('abc-123-def');
    expect(caseKebab('__abc__123__def__')).toBe('abc-123-def');
    expect(caseKebab('_-_-_-_')).toBe('');
    expect(caseKebab('12abc 12ABC')).toBe('12-abc-12-abc');
  });

  test('casePascal', () => {
    expect(casePascal('--foo-bar--')).toBe('FooBar');
    expect(casePascal('fooBar')).toBe('FooBar');
    expect(casePascal('__FOO_BAR__')).toBe('FooBar');
    expect(casePascal('XMLHttpRequest')).toBe('XmlHttpRequest');
    expect(casePascal('_abc_123_def')).toBe('Abc123Def');
    expect(casePascal('__abc__123__def__')).toBe('Abc123Def');
    expect(casePascal('_-_-_-_')).toBe('');
    expect(casePascal('12abc 12ABC')).toBe('12Abc12Abc');
  });

  test('caseCamel', () => {
    expect(caseCamel('--foo-bar--')).toBe('fooBar');
    expect(caseCamel('fooBar')).toBe('fooBar');
    expect(caseCamel('__FOO_BAR__')).toBe('fooBar');
    expect(caseCamel('XMLHttpRequest')).toBe('xmlHttpRequest');
    expect(caseCamel('_abc_123_def')).toBe('abc123Def');
    expect(caseCamel('__abc__123__def__')).toBe('abc123Def');
    expect(caseCamel('_-_-_-_')).toBe('');
    expect(caseCamel('12abc 12ABC')).toBe('12Abc12Abc');
  });
});
