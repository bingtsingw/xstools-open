import { describe, expect, test } from 'bun:test';
import { performance } from 'node:perf_hooks';
import { sleep } from './sleep';

describe('sleep', () => {
  test('pauses an async function for a given time', async () => {
    const start = performance.now();
    await sleep(100);
    const end = performance.now();

    expect(end - start).toBeGreaterThan(99);
    expect(end - start).toBeLessThan(150);
  });

  test('treats invalid ms as 0', async () => {
    const start = performance.now();
    await sleep(-1);
    await sleep(Number.NaN);
    await sleep(Number.POSITIVE_INFINITY);
    // @ts-expect-error
    await sleep('100');
    // @ts-expect-error
    await sleep(null);
    // @ts-expect-error
    await sleep(undefined);
    const end = performance.now();

    expect(end - start).toBeLessThan(50);
  });
});
