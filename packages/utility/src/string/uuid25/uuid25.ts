/**
 * inspired by: https://github.com/uuid25/javascript
 * comparison: https://github.com/paralleldrive/cuid2/issues/7
 */

import { assert, Base36MAX, chars2digits, convertBase, digits2chars, uuid } from './_utils';

/**
 * Encode a dashed UUID into a 25-character base36 uuid25 string.
 *
 * @param uuidString - A canonical 8-4-4-4-12 UUID string.
 * @returns The uuid25 encoding.
 * @throws {LogicError} When the input length/format is invalid.
 *
 * @example
 * uuid25encode('00503ecb-1584-4ca2-b698-bee4c18eb00b') // => '00o1tfx24cui2qh801gau5ukr'
 */
export const uuid25encode = (uuidString: string): string => {
  assert(uuidString.length === 36, 'invalid input');

  const cleanUuidString = uuid.cleanDash(uuidString);

  const src = chars2digits(cleanUuidString);
  const res = digits2chars(convertBase({ src, srcBase: 16, dstBase: 36, dstSize: 25 }));

  return res;
};

/**
 * Decode a uuid25 string back into a dashed UUID.
 *
 * @param uuid25String - A 25-character base36 uuid25 string.
 * @returns The canonical UUID string.
 * @throws {LogicError} When length is wrong or the value overflows 128 bits.
 *
 * @example
 * uuid25decode('00o1tfx24cui2qh801gau5ukr') // => '00503ecb-1584-4ca2-b698-bee4c18eb00b'
 */
export const uuid25decode = (uuid25String: string): string => {
  assert(uuid25String.length === 25, 'invalid input');
  assert(uuid25String <= Base36MAX, '128-bit overflow');

  const src = chars2digits(uuid25String);
  const res = digits2chars(convertBase({ src, srcBase: 36, dstBase: 16, dstSize: 32 }));

  return uuid.addDash(res);
};
