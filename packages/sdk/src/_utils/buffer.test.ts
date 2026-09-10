import { describe, expect, test } from 'bun:test';
import { Readable } from 'node:stream';
import { SdkException, SdkExceptionInternalError } from '../_errors';
import { arrayBufferToBuffer, bufferToArrayBuffer, bufferToStream, streamToBuffer } from './buffer';

describe('bufferToArrayBuffer', () => {
  test('copies only the current Buffer view', () => {
    const backing = Buffer.from('prefixPAYLOADsuffix');
    const view = backing.subarray(6, 13);
    const converted = bufferToArrayBuffer(view);
    expect(converted.byteLength).toBe(7);
    expect(arrayBufferToBuffer(converted).toString()).toBe('PAYLOAD');
    view.fill(0);
    expect(arrayBufferToBuffer(converted).toString()).toBe('PAYLOAD');
  });

  test('wraps missing input with utility context', () => {
    try {
      bufferToArrayBuffer(undefined as never);
      throw new Error('Expected conversion failure');
    } catch (error) {
      expect(SdkExceptionInternalError.is(error)).toBe(true);
      expect(error).toMatchObject({
        cause: expect.any(TypeError),
        log: expect.stringContaining('UTILS(bufferToArrayBuffer)'),
      });
    }
  });
});

describe('arrayBufferToBuffer', () => {
  test('shares an ArrayBuffer backing store', () => {
    const input = new ArrayBuffer(2);
    const view = new Uint8Array(input);
    const output = arrayBufferToBuffer(input);
    view[0] = 1;
    output[1] = 2;
    expect([...view]).toEqual([1, 2]);
    expect([...output]).toEqual([1, 2]);
  });

  test('preserves SharedArrayBuffer sharing and isolates a later Buffer copy', () => {
    const shared = new SharedArrayBuffer(4);
    const bytes = new Uint8Array(shared);
    bytes.set([1, 2, 3, 4]);
    const buffer = arrayBufferToBuffer(shared);
    bytes[0] = 9;
    expect(buffer[0]).toBe(9);
    const copy = bufferToArrayBuffer(buffer);
    bytes[0] = 8;
    expect(new Uint8Array(copy)[0]).toBe(9);
  });

  test('keeps a detached-input failure as cause', () => {
    const input = new ArrayBuffer(4);
    structuredClone(input, { transfer: [input] });
    expect(() => arrayBufferToBuffer(input)).toThrow(SdkExceptionInternalError);
    try {
      arrayBufferToBuffer(input);
      throw new Error('Expected conversion failure');
    } catch (error) {
      expect(error).toMatchObject({
        cause: expect.any(TypeError),
        log: expect.stringContaining('UTILS(arrayBufferToBuffer)'),
      });
    }
  });
});

describe('bufferToStream', () => {
  test('creates a readable binary stream', async () => {
    expect(await streamToBuffer(bufferToStream(Buffer.from('test')))).toEqual(Buffer.from('test'));
  });

  test('tags invalid input', () => {
    expect(() => bufferToStream(null as never)).toThrow(SdkExceptionInternalError);
  });
});

describe('streamToBuffer', () => {
  test('aggregates binary chunks and empty streams', async () => {
    const stream = Readable.from([Buffer.from('a'), new Uint8Array([98]), Buffer.from('中')]);
    expect((await streamToBuffer(stream)).toString()).toBe('ab中');
    expect(await streamToBuffer(Readable.from([]))).toEqual(Buffer.alloc(0));
  });

  test('preserves a source failure and closes the stream', async () => {
    const cause = new Error('broken source');
    const stream = Readable.from(
      (async function* () {
        yield Buffer.from('partial');
        throw cause;
      })(),
    );
    try {
      await streamToBuffer(stream);
      throw new Error('Expected stream failure');
    } catch (error) {
      expect(SdkExceptionInternalError.is(error)).toBe(true);
      expect((error as Error).cause).toBe(cause);
      expect((error as SdkException).log).toContain('UTILS(streamToBuffer)');
    }
    expect(stream.destroyed).toBe(true);
  });
});
