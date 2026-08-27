import { describe, expect, test } from 'bun:test';
import type { MiddlewareHandler } from 'hono';
import { Hono } from 'hono';
import { z, ZodError } from 'zod';
import { validate } from './validate';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

describe('validate', () => {
  test('types: two args, json output inferred', () => {
    const mw = validate('json', z.object({ name: z.string() }));
    type Input = typeof mw extends MiddlewareHandler<any, any, infer V> ? V : never;
    const typeCheck: Expect<Equal<Input['out']['json'], { name: string }>> = true;
    expect(typeCheck).toBe(true);
    expect(typeof mw).toBe('function');
  });

  test('runtime: valid json passes through', async () => {
    const app = new Hono().post('/', validate('json', z.object({ name: z.string() })), (c) => {
      return c.json(c.req.valid('json'));
    });

    const res = await app.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'ada' }),
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ name: 'ada' });
  });

  test('runtime: invalid json throws ZodError', async () => {
    let thrown: unknown;
    const app = new Hono()
      .onError((err, c) => {
        thrown = err;
        return c.body(null, 400);
      })
      .post('/', validate('json', z.object({ name: z.string() })), (c) => {
        return c.json(c.req.valid('json'));
      });

    const res = await app.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
    expect(thrown).toBeInstanceOf(ZodError);
  });

  test('runtime: custom hook handles invalid json', async () => {
    const app = new Hono().post(
      '/',
      validate('json', z.object({ name: z.string() }), (result, c) => {
        if (!result.success) {
          return c.json({ custom: true }, 422);
        }

        return;
      }),
      (c) => c.json(c.req.valid('json')),
    );

    const res = await app.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ custom: true });
  });

  test('runtime: custom hook still allows valid json', async () => {
    const app = new Hono().post(
      '/',
      validate('json', z.object({ name: z.string() }), (result, c) => {
        if (!result.success) {
          return c.json({ custom: true }, 422);
        }

        return;
      }),
      (c) => c.json(c.req.valid('json')),
    );

    const res = await app.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'ada' }),
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ name: 'ada' });
  });

  test('runtime: query target validates like json', async () => {
    const app = new Hono().get('/', validate('query', z.object({ q: z.string().min(1) })), (c) => {
      return c.json(c.req.valid('query'));
    });

    const ok = await app.request('/?q=hi');
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({ q: 'hi' });

    let thrown: unknown;
    const invalidApp = new Hono()
      .onError((err, c) => {
        thrown = err;
        return c.body(null, 400);
      })
      .get('/', validate('query', z.object({ q: z.string().min(1) })), (c) => {
        return c.json(c.req.valid('query'));
      });

    const bad = await invalidApp.request('/');
    expect(bad.status).toBe(400);
    expect(thrown).toBeInstanceOf(ZodError);
  });
});
