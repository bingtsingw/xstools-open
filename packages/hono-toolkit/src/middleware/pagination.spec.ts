import { describe, expect, test } from 'bun:test';
import { Hono } from 'hono';
import { pagination, type Pagination } from './pagination';

const getPage = async (path: string, options?: Parameters<typeof pagination>[0]) => {
  const app = new Hono<{ Variables: Pagination['Variables'] }>().get('/', pagination(options), (c) => {
    return c.json(c.get('page'));
  });

  const res = await app.request(path);
  expect(res.status).toBe(200);
  return res.json();
};

describe('pagination', () => {
  test('uses default page, pageSize and pageSkip', async () => {
    expect(await getPage('/')).toEqual({
      query: { page: 1, pageSize: 10, pageSkip: 0 },
      where: { offset: 0, limit: 10 },
    });
  });

  test('reads query and computes offset', async () => {
    expect(await getPage('/?page=2&pageSize=20&pageSkip=5')).toEqual({
      query: { page: 2, pageSize: 20, pageSkip: 5 },
      where: { offset: 25, limit: 20 },
    });
  });

  test('clamps page below min, including 0', async () => {
    expect(await getPage('/?page=-1')).toEqual({
      query: { page: 1, pageSize: 10, pageSkip: 0 },
      where: { offset: 0, limit: 10 },
    });
    expect(await getPage('/?page=0')).toEqual({
      query: { page: 1, pageSize: 10, pageSkip: 0 },
      where: { offset: 0, limit: 10 },
    });
  });

  test('clamps pageSize below min and above max, including 0', async () => {
    expect(await getPage('/?pageSize=-3')).toEqual({
      query: { page: 1, pageSize: 1, pageSkip: 0 },
      where: { offset: 0, limit: 1 },
    });
    expect(await getPage('/?pageSize=0')).toEqual({
      query: { page: 1, pageSize: 1, pageSkip: 0 },
      where: { offset: 0, limit: 1 },
    });
    expect(await getPage('/?pageSize=1000')).toEqual({
      query: { page: 1, pageSize: 100, pageSkip: 0 },
      where: { offset: 0, limit: 100 },
    });
  });

  test('keeps pageSkip=0 as 0', async () => {
    expect(await getPage('/?pageSkip=0')).toEqual({
      query: { page: 1, pageSize: 10, pageSkip: 0 },
      where: { offset: 0, limit: 10 },
    });
  });

  test('falls back to defaults for missing, empty or non-numeric query', async () => {
    expect(await getPage('/?page=&pageSize=&pageSkip=')).toEqual({
      query: { page: 1, pageSize: 10, pageSkip: 0 },
      where: { offset: 0, limit: 10 },
    });
    expect(await getPage('/?page=abc&pageSize=x&pageSkip=no')).toEqual({
      query: { page: 1, pageSize: 10, pageSkip: 0 },
      where: { offset: 0, limit: 10 },
    });
  });

  test('applies custom options', async () => {
    const options = {
      page: { default: 2, min: 2 },
      pageSize: { default: 20, min: 5, max: 50 },
      pageSkip: { default: 3 },
    };

    expect(await getPage('/', options)).toEqual({
      query: { page: 2, pageSize: 20, pageSkip: 3 },
      where: { offset: 23, limit: 20 },
    });
    expect(await getPage('/?page=1&pageSize=3', options)).toEqual({
      query: { page: 2, pageSize: 5, pageSkip: 3 },
      where: { offset: 8, limit: 5 },
    });
    expect(await getPage('/?page=0&pageSize=0', options)).toEqual({
      query: { page: 2, pageSize: 5, pageSkip: 3 },
      where: { offset: 8, limit: 5 },
    });
    expect(await getPage('/?pageSize=80', options)).toEqual({
      query: { page: 2, pageSize: 50, pageSkip: 3 },
      where: { offset: 53, limit: 50 },
    });
  });

  test('keeps 0 when min allows it', async () => {
    expect(await getPage('/?pageSize=0', { pageSize: { min: 0 } })).toEqual({
      query: { page: 1, pageSize: 0, pageSkip: 0 },
      where: { offset: 0, limit: 0 },
    });
  });
});
