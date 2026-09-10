import { describe, expect, spyOn, test } from 'bun:test';
import { FileTypeParser } from 'file-type';
import { Readable } from 'node:stream';
import { runInNewContext } from 'node:vm';
import { bufferToArrayBuffer, bufferToStream } from './buffer';
import { getDataInfo } from './getDataInfo';

const expectDataInfoAcrossInputs = async (data: Buffer, ext: string, mime: string) => {
  const expected = { data, size: data.length, ext, mime };
  for (const input of [data, bufferToArrayBuffer(data), bufferToStream(data)]) {
    expect(getDataInfo(input)).resolves.toEqual(expected);
  }
};

describe('getDataInfo', () => {
  test('wraps file detector failure and restores the detector after the test', async () => {
    const cause = new Error('detector failed');
    const detector = spyOn(FileTypeParser.prototype, 'fromBuffer').mockRejectedValue(cause);
    try {
      expect(getDataInfo(Buffer.from('content'))).rejects.toMatchObject({
        _tag: '__XSTOOLS_SDK__EXCEPTION_INTERNAL_ERROR',
        cause,
        log: '[XSTOOLS_SDK:UTILS(getDataInfo)]: detector failed',
      });
      expect(detector).toHaveBeenCalledTimes(1);
    } finally {
      detector.mockRestore();
    }
  });

  test('stream read failure retains its origin through getDataInfo', async () => {
    const cause = new Error('input failure');
    const stream = new Readable({
      read() {
        this.destroy(cause);
      },
    });
    expect(getDataInfo(stream)).rejects.toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_INTERNAL_ERROR',
      cause,
      log: '[XSTOOLS_SDK:UTILS(streamToBuffer)]: input failure',
    });
    expect(stream.destroyed).toBe(true);
  });

  test('does not classify SVG-like text as an SVG element', async () => {
    const data = Buffer.from('<svgPreview>plain text</svgPreview>');
    expect(await getDataInfo(data)).toMatchObject({ ext: 'txt', mime: 'text/plain' });
  });

  test('recognizes text from SharedArrayBuffer', async () => {
    const input = new SharedArrayBuffer(5);
    new Uint8Array(input).set(Buffer.from('hello'));
    expect(await getDataInfo(input)).toEqual({
      data: Buffer.from('hello'),
      size: 5,
      ext: 'txt',
      mime: 'text/plain',
    });
  });

  test('accepts ArrayBuffer from another realm', async () => {
    const input = runInNewContext('new Uint8Array([104, 105]).buffer') as ArrayBuffer;
    expect(await getDataInfo(input)).toMatchObject({ size: 2, data: Buffer.from('hi') });
  });

  test('empty input has a valid zero-byte result', async () => {
    expect(await getDataInfo(Buffer.alloc(0))).toEqual({
      data: Buffer.alloc(0),
      size: 0,
      ext: 'txt',
      mime: 'text/plain',
    });
  });

  test('unrecognized bytes preserve the existing text fallback', async () => {
    const data = Buffer.from([0, 1, 2, 3]);
    expect(await getDataInfo(data)).toEqual({ data, size: 4, ext: 'txt', mime: 'text/plain' });
  });

  test('XML-declared SVG is detected without changing its bytes', async () => {
    const data = Buffer.from('  <?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    expect(await getDataInfo(data)).toEqual({ data, size: data.length, ext: 'svg', mime: 'image/svg+xml' });
  });

  test('identifies PNG data from every supported binary input', async () => {
    await expectDataInfoAcrossInputs(
      Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAGUlEQVR4nGJpvC3LgA0wYRUdtBKAAAAA//8taQGMrRll/QAAAABJRU5ErkJggg==',
        'base64',
      ),
      'png',
      'image/png',
    );
  });

  test('identifies JPEG data from every supported binary input', async () => {
    await expectDataInfoAcrossInputs(
      Buffer.from(
        '/9j/4AAQSkZJRgABAQAAAAAAAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==',
        'base64',
      ),
      'jpg',
      'image/jpeg',
    );
  });

  test('identifies text from every supported binary input', async () => {
    await expectDataInfoAcrossInputs(Buffer.from('Hello, world!'), 'txt', 'text/plain');
  });

  test('identifies SVG from every supported binary input', async () => {
    await expectDataInfoAcrossInputs(
      Buffer.from(
        '<svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg>',
      ),
      'svg',
      'image/svg+xml',
    );
  });
});
