import { describe, expect, test } from 'bun:test';
import type { MiddlewareHandler } from 'hono';
import { Hono } from 'hono';
import { pagination, type CursorPagination } from './index';
import type { PaginationKind } from './_utils';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

const getCursor = async (path: string, options?: Parameters<typeof pagination.cursor>[0]) => {
  const app = new Hono<{ Variables: CursorPagination['Variables'] }>().get('/', pagination.cursor(options), (c) => {
    return c.json(c.get('cursor'));
  });

  const res = await app.request(path);
  expect(res.status).toBe(200);
  return res.json();
};

describe('pagination.cursor', () => {
  test('uses default limit and no cursor', async () => {
    expect(await getCursor('/')).toEqual({
      query: { limit: 10 },
      where: { limit: 10 },
    });
  });

  test('reads cursor and limit', async () => {
    expect(await getCursor('/?cursor=abc&limit=20')).toEqual({
      query: { cursor: 'abc', limit: 20 },
      where: { cursor: 'abc', limit: 20 },
    });
  });

  test('treats empty cursor as first page', async () => {
    expect(await getCursor('/?cursor=')).toEqual({
      query: { limit: 10 },
      where: { limit: 10 },
    });
  });

  test('clamps limit below min and above max, including 0', async () => {
    expect(await getCursor('/?limit=-3')).toEqual({
      query: { limit: 1 },
      where: { limit: 1 },
    });
    expect(await getCursor('/?limit=0')).toEqual({
      query: { limit: 1 },
      where: { limit: 1 },
    });
    expect(await getCursor('/?limit=1000')).toEqual({
      query: { limit: 100 },
      where: { limit: 100 },
    });
  });

  test('falls back to default for missing, empty or non-numeric limit', async () => {
    expect(await getCursor('/?limit=')).toEqual({
      query: { limit: 10 },
      where: { limit: 10 },
    });
    expect(await getCursor('/?limit=no')).toEqual({
      query: { limit: 10 },
      where: { limit: 10 },
    });
  });

  test('applies custom options', async () => {
    const options = { limit: { default: 20, min: 5, max: 50 } };

    expect(await getCursor('/', options)).toEqual({
      query: { limit: 20 },
      where: { limit: 20 },
    });
    expect(await getCursor('/?limit=3', options)).toEqual({
      query: { limit: 5 },
      where: { limit: 5 },
    });
    // 大于 default、未超过 max：保留原值
    expect(await getCursor('/?limit=30', options)).toEqual({
      query: { limit: 30 },
      where: { limit: 30 },
    });
    // 超过 max（且 max > default）：保留 max
    expect(await getCursor('/?limit=80', options)).toEqual({
      query: { limit: 50 },
      where: { limit: 50 },
    });
  });

  test('keeps 0 when min allows it', async () => {
    expect(await getCursor('/?limit=0', { limit: { min: 0 } })).toEqual({
      query: { limit: 0 },
      where: { limit: 0 },
    });
  });

  test('passes query cursor through without parsing payload', async () => {
    expect(await getCursor('/?cursor=a%3Ab')).toEqual({
      query: { cursor: 'a:b', limit: 10 },
      where: { cursor: 'a:b', limit: 10 },
    });
  });

  test('types: middleware input carries cursor kind', () => {
    const mw = pagination.cursor();
    type Input = typeof mw extends MiddlewareHandler<any, any, infer V> ? V : never;
    type Marker = Input extends { in: { __paginationKind?: infer V } } ? Exclude<V, undefined> : never;
    const typeCheck: Expect<Equal<Marker, 'cursor'>> = true;
    const kindCheck: Expect<Equal<Extract<PaginationKind, 'cursor'>, 'cursor'>> = true;

    expect(typeCheck).toBe(true);
    expect(kindCheck).toBe(true);
    expect(typeof mw).toBe('function');
  });

  test('types: Hono schema keeps cursor kind on route input', () => {
    const app = new Hono().get('/', pagination.cursor(), (c) => c.json(c.get('cursor')));
    type Input =
      typeof app extends Hono<any, infer S> ? (S extends { '/': { $get: { input: infer I } } } ? I : never) : never;
    type Marker = Input extends { __paginationKind?: infer V } ? Exclude<V, undefined> : never;
    const typeCheck: Expect<Equal<Marker, 'cursor'>> = true;

    expect(typeCheck).toBe(true);
    expect(app).toBeInstanceOf(Hono);
  });
});
