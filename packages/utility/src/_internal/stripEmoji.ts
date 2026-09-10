/**
 * One emoji unit: pictograph, optional modifier / tag sequence / VS16+keycap.
 * Structure follows emoji-regex-xs@2.0.1 (MIT), with keycaps as their own
 * alternative so a digit next to an emoji still matches (Bun's engine does not
 * resume after the nested negative lookahead in the upstream pattern).
 * @see https://github.com/slevithan/emoji-regex-xs
 */
const r = String.raw;
const emojiUnit = r`\p{Emoji}(?:\p{EMod}|[\u{E0020}-\u{E007E}]+\u{E007F}|\uFE0F?\u20E3?)`;

/** Fresh `/gu` instance so `lastIndex` cannot leak across calls. */
const createEmojiRegExp = (): RegExp =>
  new RegExp(r`\p{RI}{2}|[#*\d]\uFE0F?\u20E3|(?![\d#*])${emojiUnit}(?:\u200D${emojiUnit})*`, 'gu');

export const stripEmoji = (input: string): string => input.replace(createEmojiRegExp(), '');
