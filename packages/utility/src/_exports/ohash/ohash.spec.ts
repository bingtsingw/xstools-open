import { describe, expect, test } from 'bun:test';
import { digest, hash, isEqual, serialize } from './ohash';

describe('ohash', () => {
  test('ohash/serialize', () => {
    expect(serialize({ a: 'a', b: 'b' })).toBe("{a:'a',b:'b'}");
    expect(serialize({ b: 'b', a: 'a' })).toBe("{a:'a',b:'b'}");
  });

  test('ohash/digest', () => {
    expect(digest("{a:'a',b:'b'}")).toBe('PgfS7NmScXfpp1fo8ePH6lClHOCsSKAg8wLLAC8kG68');
  });

  test('ohash/hash', () => {
    expect(hash({ a: 'a', b: 'b' })).toBe(digest(serialize({ b: 'b', a: 'a' })));
    expect(hash({ a: 'a', b: 'b' })).toBe('PgfS7NmScXfpp1fo8ePH6lClHOCsSKAg8wLLAC8kG68');
    expect(hash({ b: 'b', a: 'a' })).toBe('PgfS7NmScXfpp1fo8ePH6lClHOCsSKAg8wLLAC8kG68');
  });

  test('ohash/isEqual', () => {
    expect(isEqual({ a: 'a', b: 'b' }, { b: 'b', a: 'a' })).toBe(true);
  });
});
