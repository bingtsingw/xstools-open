import { describe, expect, test } from 'bun:test';
import { template } from './template';

describe('template', () => {
  test('normal usage', () => {
    expect(template('hello, {{name}}', { name: 'world' })).toBe('hello, world');
    expect(template('hello, {{    name  \n}}', { name: 'world' })).toBe('hello, world');
    expect(template('hello, {{name}}', {})).toBe('hello, ');
    expect(template('hello, {{name}}', { age: 1 })).toBe('hello, ');
    expect(template('hello, {{name}}{{!}}', { '!': '！' })).toBe('hello, ！');
    expect(template('count={{ count }}', { count: 0 })).toBe('count=0');
    expect(template('ok={{ ok }}', { ok: false })).toBe('ok=false');
  });

  test('empty', () => {
    expect(template('', { name: 'world' })).toBe('');
    expect(template('', {})).toBe('');
    expect(template(null, {})).toBe('');
    expect(template(undefined, {})).toBe('');
    expect(template('hello', {})).toBe('hello');

    expect(template('hello {{ }}', {})).toBe('hello ');
    expect(template('hello {{ name }}', {})).toBe('hello ');
  });

  test('do not support {}', () => {
    expect(template('hello { name }', {})).toBe('hello { name }');
  });

  test('inserts $-sequences in values literally', () => {
    expect(template('price {{ p }}', { p: '$5' })).toBe('price $5');
    expect(template('x {{ v }}', { v: '$$' })).toBe('x $$');
    expect(template('y {{ v }}', { v: 'a$&b' })).toBe('y a$&b');
    expect(template('z {{ v }}', { v: "$`$'" })).toBe("z $`$'");
  });

  test('does not re-expand injected placeholders or mis-handle repeats', () => {
    expect(template('{{ a }} {{ b }}', { a: '{{ b }}', b: 'x' })).toBe('{{ b }} x');
    expect(template('{{ a }}-{{ a }}', { a: '1' })).toBe('1-1');
  });
});
