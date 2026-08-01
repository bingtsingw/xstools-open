import { createId, init, isCuid } from '@paralleldrive/cuid2';

export const isCuid2 = isCuid;
export const createCuid2 = init;

/**
 * Generate a CUID2. Pass `length` to override the default size.
 *
 * @example
 * cuid2() // => 24-char id
 * cuid2(6) // => 6-char id
 */
export const cuid2 = (length?: number) => {
  if (length) {
    return createCuid2({ length })();
  }

  return createId();
};
