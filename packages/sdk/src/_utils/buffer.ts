import { Readable } from 'stream';
import { utilsError } from './utilsError';

export const bufferToArrayBuffer = (buffer: Buffer): ArrayBufferLike => {
  try {
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  } catch (cause) {
    throw utilsError('bufferToArrayBuffer', cause);
  }
};

export const arrayBufferToBuffer = (byteArray: ArrayBufferLike): Buffer => {
  try {
    return Buffer.from(byteArray);
  } catch (cause) {
    throw utilsError('arrayBufferToBuffer', cause);
  }
};

export const bufferToStream = (buffer: Buffer): Readable => {
  try {
    return Readable.from(buffer);
  } catch (cause) {
    throw utilsError('bufferToStream', cause);
  }
};

export const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  try {
    return Buffer.concat(await Array.fromAsync(stream));
  } catch (cause) {
    stream.destroy();
    throw utilsError('streamToBuffer', cause);
  }
};
