import { createId, init, isCuid } from '@paralleldrive/cuid2';

export const isCuid2 = isCuid;
export const createCuid2 = init;

/**
 * Generate a CUID2. Pass a positive `length` to override the default size (24).
 * `0`, negative, or omitted `length` uses the default generator.
 *
 * @param length - Positive id length. Non-positive values are ignored.
 *
 * @example
 * cuid2() // => 24-char id
 * cuid2(6) // => 6-char id
 */
export const cuid2 = (length?: number) => {
  if (typeof length === 'number' && length > 0) {
    return createCuid2({ length })();
  }

  return createId();
};
