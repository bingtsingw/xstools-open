/**
 * UUID25 格式的最大值（对应 UUID 的最大值 ffffffff-ffff-ffff-ffff-ffffffffffff）
 * 这是一个 36 进制的 25 位字符串表示
 */
export const Base36MAX = 'f5lxx1zz5pnorynqglhzmsp33';

/**
 * 8-4-4-4-12格式
 * 如: 00503ecb-1584-4ca2-b698-bee4c18eb00b
 */
const uuidRegex = /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i;

export const assert: (cond: boolean, msg: string) => asserts cond = (cond, msg) => {
  if (!cond) {
    throw new Error('Assertion failed: ' + msg);
  }
};

export const uuid = {
  assert: (s: string) => {
    assert(uuidRegex.test(s), 'invalid uuid');
  },

  cleanDash: (s: string): string => {
    uuid.assert(s);
    return uuidRegex.exec(s)?.slice(1, 6).join('') as string;
  },

  addDash: (s: string): string => {
    const u = `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20, 32)}`;
    uuid.assert(u);
    return u;
  },
};

/**
 * 将字符串编码为数值数组
 * @param chars - 要编码的字符串（如 "abc123"）
 *
 * @example
 * chars2digits("1a2b") // 返回 [1, 10, 2, 11]
 */
export const chars2digits = (chars: string): Uint8Array => {
  // ASCII 字符到数值的映射表
  // 0x7f 表示无效字符
  // 索引 48-57  (字符 0-9) 映射到 0x00-0x09
  // 索引 65-90  (字符 A-Z) 映射到 0x0a-0x23
  // 索引 97-122 (字符 a-z) 映射到 0x0a-0x23
  // prettier-ignore
  const MAP = [
    0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
    0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, // 0-9
    0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
    0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x21, 0x22, 0x23, // A-Z
    0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
    0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x21, 0x22, 0x23, // a-z
    0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
  ];

  const len = chars.length;
  const digits = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    const v = MAP[chars.charCodeAt(i)] ?? 0x7f; // 将字符转换为对应的数值
    assert(v !== 0x7f, 'invalid chars');
    digits[i] = v;
  }

  return digits;
};

/**
 * 将数值数组编码为字符串
 * @param digits - 要编码的数值数组, 长度为32或25
 */
export const digits2chars = (digits: Uint8Array): string => {
  assert(digits.length === 32 || digits.length === 25, 'invalid length of digit value array');

  const MAP = '0123456789abcdefghijklmnopqrstuvwxyz';
  let chars = '';
  for (const e of digits) {
    assert(e < MAP.length, 'invalid digit value');
    chars += MAP.charAt(e);
  }
  return chars;
};

/**
 * 进制转换
 * @param src - 源数值数组
 * @param srcBase - 源进制（2-256）
 * @param dstBase - 目标进制（2-256）
 * @param dstSize - 目标数组大小
 *
 * @example
 * 将16进制 [15, 15] (0xFF) 转换为10进制
 * convertBase(new Uint8Array([15, 15]), 16, 10, 3) => [2, 5, 5] (255)
 */
export const convertBase = ({
  src,
  srcBase,
  dstBase,
  dstSize,
}: {
  src: Uint8Array;
  srcBase: number;
  dstBase: number;
  dstSize: number;
}): Uint8Array => {
  assert(2 <= srcBase && srcBase <= 256 && 2 <= dstBase && dstBase <= 256, 'invalid base');

  // 确定每次外循环要读取的源数字位数
  // 这样做是为了优化性能，一次处理多个数字
  let wordLen = 1;
  let wordBase = srcBase;
  while (wordBase <= Number.MAX_SAFE_INTEGER / (srcBase * dstBase)) {
    wordLen++;
    wordBase *= srcBase;
  }

  const dst = new Uint8Array(dstSize);

  const srcSize = src.length;
  if (srcSize === 0) {
    return dst;
  } else {
    assert(dstSize > 0, 'too small dst');
  }

  // 用于记录目标数组已填充的范围
  let dstUsed = dstSize - 1;

  // 每次外循环从源数组读取 wordLen 个数字
  let wordHead = srcSize % wordLen;
  if (wordHead > 0) {
    wordHead -= wordLen;
  }

  for (; wordHead < srcSize; wordHead += wordLen) {
    // 将 wordLen 个源数字合并为一个大数
    let carry = 0;
    for (let i = wordHead < 0 ? 0 : wordHead; i < wordHead + wordLen; i++) {
      assert(src[i]! < srcBase, 'invalid src digit');
      carry = carry * srcBase + src[i]!;
    }

    // 从右到左填充目标数组，同时将之前的结果向左进位
    for (let i = dstSize - 1; i >= 0; i--) {
      carry += dst[i]! * wordBase;
      const quo = Math.trunc(carry / dstBase);
      dst[i] = carry - quo * dstBase; // 余数
      carry = quo;

      // 当进位为零且剩余的目标数字都为零时，跳出内循环
      if (carry === 0 && i <= dstUsed) {
        dstUsed = i;
        break;
      }
    }
    assert(carry === 0, 'too small dst');
  }

  return dst;
};
