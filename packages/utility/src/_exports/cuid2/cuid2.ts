import { createId, init, isCuid } from '@paralleldrive/cuid2';

export const isCuid2 = isCuid;
export const createCuid2 = init;

export const cuid2 = (length?: number) => {
  if (length) {
    return createCuid2({ length: 6 })();
  }

  return createId();
};
