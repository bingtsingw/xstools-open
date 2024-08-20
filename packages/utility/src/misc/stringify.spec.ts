import { describe, expect, test } from 'bun:test';
import { stringify } from './stringify';

describe('misc', () => {
  test('stringify', () => {
    expect(stringify({ a: '1' })).toEqual('{"a":"1"}');
    expect(stringify('{"a":"1"}')).toEqual('{"a":"1"}');
    expect(() => stringify('asd')).toThrow('Not Valid JSON');
    expect(() => stringify(true)).toThrow('Not Valid JSON');
  });
});
