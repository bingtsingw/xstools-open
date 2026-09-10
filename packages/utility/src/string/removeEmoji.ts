import { stripEmoji } from '../_internal/stripEmoji';

type CleanValue<T> = T extends string ? string : T;

/**
 * Removes complete emoji sequences from a string and leaves other text and
 * whitespace intact. Non-string input is returned unchanged.
 *
 * Uses the current environment's Unicode properties (ZWJ sequences, modifiers,
 * flags, tags, keycaps). Digits, `#`, and `*` are kept unless they form a
 * keycap. Isolated ZWJ / variation selectors are kept.
 *
 * @param input - Any value; only strings are cleaned.
 * @returns The cleaned string, or the original non-string value.
 *
 * @example
 * removeEmoji('你好👍🏽') // => '你好'
 * removeEmoji('Hello 👋') // => 'Hello '
 * removeEmoji(1) // => 1
 */
export const removeEmoji = <T>(input: T): CleanValue<T> => {
  if (typeof input !== 'string') {
    return input as CleanValue<T>;
  }

  return stripEmoji(input) as CleanValue<T>;
};
