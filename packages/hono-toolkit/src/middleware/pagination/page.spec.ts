import { describe, expect, test } from 'bun:test';
import type { MiddlewareHandler } from 'hono';
import { Hono } from 'hono';
import { pagination, type PagePagination } from './index';
import type { PaginationKind } from './_utils';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

const getPage = async (path: string, options?: Parameters<typeof pagination.page>[0]) => {
  const app = new Hono<{ Variables: PagePagination['Variables'] }>().get('/', pagination.page(options), (c) => {
    return c.json(c.get('page'));
  });

  const res = await app.request(path);
  expect(res.status).toBe(200);
  return res.json();
};

describe('pagination.page', () => {
  test('uses default page and pageSize', async () => {
    expect(await getPage('/')).toEqual({
      query: { page: 1, pageSize: 10 },
      where: { offset: 0, limit: 10 },
    });
  });

  test('reads query and computes offset', async () => {
    expect(await getPage('/?page=2&pageSize=20')).toEqual({
      query: { page: 2, pageSize: 20 },
      where: { offset: 20, limit: 20 },
    });
  });

  test('clamps page below min, including 0', async () => {
    expect(await getPage('/?page=-1')).toEqual({
      query: { page: 1, pageSize: 10 },
      where: { offset: 0, limit: 10 },
    });
    expect(await getPage('/?page=0')).toEqual({
      query: { page: 1, pageSize: 10 },
      where: { offset: 0, limit: 10 },
    });
  });

  test('clamps pageSize below min and above max, including 0', async () => {
    expect(await getPage('/?pageSize=-3')).toEqual({
      query: { page: 1, pageSize: 1 },
      where: { offset: 0, limit: 1 },
    });
    expect(await getPage('/?pageSize=0')).toEqual({
      query: { page: 1, pageSize: 1 },
      where: { offset: 0, limit: 1 },
    });
    expect(await getPage('/?pageSize=1000')).toEqual({
      query: { page: 1, pageSize: 100 },
      where: { offset: 0, limit: 100 },
    });
  });

  test('falls back to defaults for missing, empty or non-numeric query', async () => {
    expect(await getPage('/?page=&pageSize=')).toEqual({
      query: { page: 1, pageSize: 10 },
      where: { offset: 0, limit: 10 },
    });
    expect(await getPage('/?page=abc&pageSize=x')).toEqual({
      query: { page: 1, pageSize: 10 },
      where: { offset: 0, limit: 10 },
    });
  });

  test('applies custom options', async () => {
    const options = {
      page: { default: 2, min: 2 },
      pageSize: { default: 20, min: 5, max: 50 },
    };

    expect(await getPage('/', options)).toEqual({
      query: { page: 2, pageSize: 20 },
      where: { offset: 20, limit: 20 },
    });
    expect(await getPage('/?page=1&pageSize=3', options)).toEqual({
      query: { page: 2, pageSize: 5 },
      where: { offset: 5, limit: 5 },
    });
    expect(await getPage('/?page=0&pageSize=0', options)).toEqual({
      query: { page: 2, pageSize: 5 },
      where: { offset: 5, limit: 5 },
    });
    // 大于 default、未超过 max：保留原值
    expect(await getPage('/?pageSize=30', options)).toEqual({
      query: { page: 2, pageSize: 30 },
      where: { offset: 30, limit: 30 },
    });
    // 超过 max（且 max > default）：保留 max
    expect(await getPage('/?pageSize=80', options)).toEqual({
      query: { page: 2, pageSize: 50 },
      where: { offset: 50, limit: 50 },
    });
  });

  test('keeps 0 when min allows it', async () => {
    expect(await getPage('/?pageSize=0', { pageSize: { min: 0 } })).toEqual({
      query: { page: 1, pageSize: 0 },
      where: { offset: 0, limit: 0 },
    });
  });

  test('types: middleware input carries page kind', () => {
    const mw = pagination.page();
    type Input = typeof mw extends MiddlewareHandler<any, any, infer V> ? V : never;
    type Marker = Input extends { in: { __paginationKind?: infer V } } ? Exclude<V, undefined> : never;
    const typeCheck: Expect<Equal<Marker, 'page'>> = true;
    const kindCheck: Expect<Equal<Extract<PaginationKind, 'page'>, 'page'>> = true;

    expect(typeCheck).toBe(true);
    expect(kindCheck).toBe(true);
    expect(typeof mw).toBe('function');
  });

  test('types: Hono schema keeps page kind on route input', () => {
    const app = new Hono().get('/', pagination.page(), (c) => c.json(c.get('page')));
    type Input =
      typeof app extends Hono<any, infer S> ? (S extends { '/': { $get: { input: infer I } } } ? I : never) : never;
    type Marker = Input extends { __paginationKind?: infer V } ? Exclude<V, undefined> : never;
    const typeCheck: Expect<Equal<Marker, 'page'>> = true;

    expect(typeCheck).toBe(true);
    expect(app).toBeInstanceOf(Hono);
  });
});
