/**
 * inspired by: https://github.com/uuid25/javascript
 */

import { assert, Base36MAX, chars2digits, convertBase, digits2chars, uuid } from './_utils';

/**
 * uuid -> uuid25
 *
 * @example
 * uuid25encode('00503ecb-1584-4ca2-b698-bee4c18eb00b') => '00o1tfx24cui2qh801gau5ukr'
 */
export const uuid25encode = (uuidString: string): string => {
  assert(uuidString.length === 36, 'invalid input');

  const cleanUuidString = uuid.cleanDash(uuidString);

  const src = chars2digits(cleanUuidString);
  const res = digits2chars(convertBase({ src, srcBase: 16, dstBase: 36, dstSize: 25 }));

  return res;
};

/**
 * uuid25 -> uuid
 *
 * @example
 * uuid25decode('00o1tfx24cui2qh801gau5ukr') => '00503ecb-1584-4ca2-b698-bee4c18eb00b'
 */
export const uuid25decode = (uuid25String: string): string => {
  assert(uuid25String.length === 25, 'invalid input');
  assert(uuid25String <= Base36MAX, '128-bit overflow');

  const src = chars2digits(uuid25String);
  const res = digits2chars(convertBase({ src, srcBase: 36, dstBase: 16, dstSize: 32 }));

  return uuid.addDash(res);
};
