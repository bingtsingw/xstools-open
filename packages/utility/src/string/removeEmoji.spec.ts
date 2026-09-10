import { describe, expect, expectTypeOf, test } from 'bun:test';
import { removeEmoji } from './removeEmoji';

describe('removeEmoji', () => {
  test.each(['😊', '❤️', '👨‍👩‍👧‍👦', '👍🏽', '🇨🇳', '1️⃣', '#️⃣', '*️⃣', '🏳️‍🌈', '⌚', '↔️', '👩', '👩🏿'])(
    'removes the complete sequence %s',
    (emoji) => {
      expect(removeEmoji(`前${emoji}后${emoji}`)).toBe('前后');
      expect(removeEmoji(emoji)).toBe('');
    },
  );

  test('preserves ordinary text, whitespace and unrelated format characters', () => {
    const text = '订单123 # *\n\t 中文 hello \u200d \ufe0f';
    expect(removeEmoji(text)).toBe(text);
    expect(removeEmoji('')).toBe('');
    expect(removeEmoji('Hello 👋, how are you? 😊')).toBe('Hello , how are you? ');
  });

  test('pins text and emoji presentation of ambiguous symbols', () => {
    expect(removeEmoji('© ™ ♥')).toBe('  ');
    expect(removeEmoji('©️ ™️ ♥️')).toBe('  ');
  });

  test('keeps digits, hash and star unless they form a keycap', () => {
    expect(removeEmoji('订单123 # *')).toBe('订单123 # *');
    expect(removeEmoji('1😊')).toBe('1');
    expect(removeEmoji('值1😊')).toBe('值1');
    expect(removeEmoji('1\u20E3')).toBe('');
    expect(removeEmoji('1\uFE0F\u20E3')).toBe('');
  });

  test('strips tag sequences and modifier+ZWJ sequences', () => {
    expect(removeEmoji('\u{1F3F4}\u{E0075}\u{E0073}\u{E0074}\u{E0078}\u{E007F}')).toBe('');
    expect(removeEmoji('\u{1F93C}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}')).toBe('');
  });

  test('does not leak lastIndex across calls', () => {
    expect(removeEmoji('😊A😊')).toBe('A');
    expect(removeEmoji('😊A😊')).toBe('A');
  });

  test.each(
    [
      true,
      false,
      0,
      1,
      NaN,
      1n,
      null,
      undefined,
      Symbol('😊'),
      { text: '😊' },
      ['😊'],
      new String('😊'),
      () => '😊',
    ].map((value) => ({ value })),
  )('returns non-string input unchanged %p', ({ value }) => {
    expect(removeEmoji(value)).toBe(value);
  });

  test('preserves non-string types and widens string types, including unions', () => {
    expectTypeOf(removeEmoji('😊' as const)).toEqualTypeOf<string>();
    expectTypeOf(removeEmoji(1 as const)).toEqualTypeOf<1>();
    expectTypeOf(removeEmoji(null)).toEqualTypeOf<null>();
    expectTypeOf(removeEmoji(undefined)).toEqualTypeOf<undefined>();
    const object = { text: '😊' } as const;
    expectTypeOf(removeEmoji(object)).toEqualTypeOf<typeof object>();
    expectTypeOf(removeEmoji('😊' as '😊' | null | 1)).toEqualTypeOf<string | null | 1>();
  });
});
