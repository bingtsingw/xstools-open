export const sleep = (ms: number): Promise<void> => {
  return new Promise((r) => {
    setTimeout(r, ms);
  });
};
