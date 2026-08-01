/**
 * Asynchronously wait for time to pass.
 *
 * Non-number, non-finite, or negative `ms` is treated as `0`.
 *
 * @example
 * await sleep(1000);
 */
export const sleep = async (ms: number): Promise<void> => {
  const delay = typeof ms !== 'number' || !Number.isFinite(ms) || ms < 0 ? 0 : ms;

  await new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};
