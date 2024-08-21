import { describe, expect, test } from 'bun:test';
import { pathToSegments } from './pathToSegments';

describe('pathToSegments', () => {
  test('normal usage', () => {
    expect(pathToSegments('a.b.c')).toEqual(['a', 'b', 'c']);
    expect(pathToSegments('a[b][c]')).toEqual(['a', 'b', 'c']);
    expect(pathToSegments('a[b].c')).toEqual(['a', 'b', 'c']);
    expect(pathToSegments('a["b.c"].d')).toEqual(['a', 'b.c', 'd']);
    expect(pathToSegments('a[b.c].d')).toEqual(['a', 'b.c', 'd']);
    expect(pathToSegments('.a.b.c')).toEqual(['', 'a', 'b', 'c']);
  });

  test('empty', () => {
    expect(pathToSegments('')).toEqual([]);
    expect(pathToSegments('.')).toEqual(['', '']);
    expect(pathToSegments('[]')).toEqual(['']);
    expect(pathToSegments('a[].b')).toEqual(['a', '', 'b']);
  });

  test('one path', () => {
    expect(pathToSegments('a')).toEqual(['a']);
    expect(pathToSegments('[a]')).toEqual(['a']);
    expect(pathToSegments('[a.b]')).toEqual(['a.b']);
    expect(pathToSegments('["a.b"]')).toEqual(['a.b']);
    expect(pathToSegments('"[a.b]"')).toEqual(['"', 'a.b', '"']);
  });

  test('complex', () => {
    expect(pathToSegments('a[-1.23]["[\\"b\\"]"].c[\'[\\\'d\\\']\'][\ne\n][f].g')).toEqual([
      'a',
      '-1.23',
      '["b"]',
      'c',
      "['d']",
      '\ne\n',
      'f',
      'g',
    ]);

    expect(pathToSegments('.a[b].c.d[e]["f.g"].h')).toEqual(['', 'a', 'b', 'c', 'd', 'e', 'f.g', 'h']);
  });
});
