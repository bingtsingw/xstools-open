import { describe, expect, test } from 'bun:test';
import { template } from './template';

describe('template', () => {
  test('normal usage', () => {
    expect(template('hello, {{name}}', { name: 'world' })).toBe('hello, world');
    expect(template('hello, {{    name  \n}}', { name: 'world' })).toBe('hello, world');
    expect(template('hello, {{name}}', {})).toBe('hello, ');
    expect(template('hello, {{name}}', { age: 1 })).toBe('hello, ');
    expect(template('hello, {{name}}{{!}}', { '!': '！' })).toBe('hello, ！');
  });

  test('empty', () => {
    expect(template('', { name: 'world' })).toBe('');
    expect(template('', {})).toBe('');
    expect(template('hello', {})).toBe('hello');

    expect(template('hello {{ }}', {})).toBe('hello ');
    expect(template('hello {{ name }}', {})).toBe('hello ');
  });

  test('do not support {}', () => {
    expect(template('hello { name }', {})).toBe('hello { name }');
  });
});
