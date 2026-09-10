import { fileTypeFromBuffer } from 'file-type';
import { Readable } from 'node:stream';
import { isAnyArrayBuffer } from 'node:util/types';
import { arrayBufferToBuffer, streamToBuffer } from './buffer';
import { utilsError } from './utilsError';

const textIsSvg = (text: string): boolean => {
  return /^(<\?xml[^>]*\?>[\s\S]*)?<svg[\s>]/i.test(text);
};

/** Read and identify binary data.
 * @example await getDataInfo(Buffer.from('hello'));
 * @throws {SdkExceptionInternalError} Unsupported input, stream or detection failure.
 */
export const getDataInfo = async <T extends Buffer | ArrayBufferLike | Readable>(
  input: T,
): Promise<{ data: Buffer; size: number; ext: string; mime: string }> => {
  try {
    let data: Buffer;

    if (Buffer.isBuffer(input)) {
      data = input;
    } else if (isAnyArrayBuffer(input)) {
      data = arrayBufferToBuffer(input);
    } else if (input instanceof Readable) {
      data = await streamToBuffer(input);
    } else {
      throw new TypeError(
        `Expected the input argument to be of type Buffer | ArrayBufferLike | Readable, got ${typeof input}`,
      );
    }
    const type = await fileTypeFromBuffer(data);

    if (type) {
      return { size: data.length, data, ...type };
    }

    // fileTypeFromBuffer无法识别文本格式（如SVG），需要对text格式做额外检测

    // 只检查前 1024 字节，避免对大文件做全量字符串转换
    const sample = data.subarray(0, 1024).toString('utf-8').trim();

    if (textIsSvg(sample)) {
      return {
        size: data.length,
        data,
        ext: 'svg',
        mime: 'image/svg+xml',
      };
    }

    return { size: data.length, data, ext: 'txt', mime: 'text/plain' };
  } catch (cause) {
    throw utilsError('getDataInfo', cause);
  }
};
