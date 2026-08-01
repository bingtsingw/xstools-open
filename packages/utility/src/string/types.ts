/**
 * Accepts `string | null | undefined`.
 *
 * Nullish values are soft-handled by string APIs (typically `''` or `[]`).
 * Other non-string runtime values are outside this contract — some APIs
 * (e.g. `subString`) may throw `ParamError`.
 */
export type MaybeString = string | null | undefined;
