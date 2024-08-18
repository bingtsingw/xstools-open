/**
 * Asynchronously wait for time to pass
 *
 * @example
 * await sleep(1000);
 */
export const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
