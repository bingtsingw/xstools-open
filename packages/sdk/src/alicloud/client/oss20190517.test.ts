import { describe, expect, test } from 'bun:test';
import { createHmac } from 'crypto';
import { Readable } from 'node:stream';
import type { SdkHttpOptions } from '../../_transport';
import { AlicloudClientOss20190517 } from './oss20190517';

const config = {
  accessKeyId: 'ak_test',
  accessKeySecret: 'sk_test',
  region: 'cn-hangzhou',
  host: 'bucket-test.oss-cn-hangzhou.aliyuncs.com',
  bucket: 'bucket-test',
};

describe('AlicloudClientOss20190517', () => {
  describe('objectPut', () => {
    test('reads an oversized stream before rejecting it without an upload request', async () => {
      let produced = 0;
      let requests = 0;
      const stream = Readable.from(
        (async function* () {
          for (let i = 0; i < 100; i++) {
            produced++;
            yield Buffer.alloc(1024);
          }
        })(),
        { highWaterMark: 1 },
      );
      const client = new AlicloudClientOss20190517(config, {
        fetch: async () => {
          requests++;
          return new Response(null);
        },
      });
      expect(client.objectPut({ input: stream, limitSize: 1 / 1024 })).rejects.toMatchObject({
        _tag: '__XSTOOLS_SDK__EXCEPTION_INTERNAL_ERROR',
        source: 'ALI-OSS',
        operation: 'objectPut',
        message: 'Exceeded limit file size',
      });
      expect(produced).toBe(100);
      expect(requests).toBe(0);
    });

    test('uploads SharedArrayBuffer data at the exact limit', async () => {
      const input = new SharedArrayBuffer(5);
      new Uint8Array(input).set(Buffer.from('hello'));
      let requests = 0;
      const client = new AlicloudClientOss20190517(config, {
        fetch: async (input, init) => {
          requests++;
          expect(await new Request(input, init).text()).toBe('hello');
          return new Response(null);
        },
      });
      await client.objectPut({ input, limitSize: 5 / 1024 / 1024 });
      expect(requests).toBe(1);
    });

    test('sends bytes, metadata and returns the uploaded URL', async () => {
      const inputBytes = Buffer.from('offline upload content');
      const requests: Request[] = [];
      const client = new AlicloudClientOss20190517(config, {
        fetch: async (input, init) => {
          const request = new Request(input, init);
          requests.push(request);
          expect(request.method).toBe('PUT');
          expect(request.headers.get('content-type')).toBe('text/plain');
          expect(request.headers.get('content-length')).toBe(String(inputBytes.length));
          expect(Buffer.from(await request.arrayBuffer())).toEqual(inputBytes);
          return new Response(null, { status: 200 });
        },
      });
      const url = await client.objectPut({ input: inputBytes, prefix: 'offline' });

      expect(requests).toHaveLength(1);
      expect(url).toStartWith(`https://${config.host}/offline/`);
      expect(url).toBe(requests[0]!.url);
    });
  });

  describe('getUploadSignature', () => {
    test('creates matching bucket, key, size and expiry constraints', () => {
      const client = new AlicloudClientOss20190517(config);
      const before = Date.now();
      const result = client.getUploadSignature({ size: 2, expire: 10, prefix: 'test-prefix' });
      const after = Date.now();
      const policy = JSON.parse(Buffer.from(result.policy, 'base64').toString());

      expect(result.host).toBe(`https://${config.host}`);
      expect(result.ak).toBe(config.accessKeyId);
      expect(result.id).toBe(result.key);
      expect(result.key).toStartWith('test-prefix/');
      expect(policy.conditions).toEqual([
        { bucket: config.bucket },
        { key: result.key },
        ['content-length-range', 0, 2 * 1024 * 1024],
      ]);
      expect(Date.parse(policy.expiration)).toBeGreaterThanOrEqual(before + 600_000);
      expect(Date.parse(policy.expiration)).toBeLessThanOrEqual(after + 600_000);
      expect(result.signature).toBe(createHmac('sha1', config.accessKeySecret).update(result.policy).digest('base64'));
    });
  });

  describe('objectCopy', () => {
    test('uses the source bucket override when sending the copy header', async () => {
      const client = new AlicloudClientOss20190517(config, {
        fetch: async (input, init) => {
          const request = new Request(input, init);
          expect(request.method).toBe('PUT');
          expect(new URL(request.url).pathname).toBe('/target.txt');
          expect(request.headers.get('x-oss-copy-source')).toBe('/source-bucket/source.txt');
          return new Response(null, { status: 200 });
        },
      });

      await client.objectCopy({ source: 'source.txt', target: 'target.txt', sourceBucket: 'source-bucket' });
    });

    test('uses the same encoded key in the request URL and copy header', async () => {
      const client = new AlicloudClientOss20190517(config, {
        fetch: async (input, init) => {
          const request = new Request(input, init);
          expect(request.url).toBe(`https://${config.host}/target%20%3F%23%25%21.txt`);
          expect(request.headers.get('x-oss-copy-source')).toBe('/source-bucket/source%20%3F%23%25%21.txt');
          return new Response(null, { status: 200 });
        },
      });

      await client.objectCopy({
        source: `https://${config.host}/source%20%3F%23%25%21.txt`,
        target: 'target ?#%!.txt',
        sourceBucket: 'source-bucket',
      });
    });
  });

  describe('objectDelete', () => {
    test('extracts and encodes an object key from an absolute URL', async () => {
      const client = new AlicloudClientOss20190517(config, {
        fetch: async (input, init) => {
          const request = new Request(input, init);
          expect(request.method).toBe('DELETE');
          expect(request.url).toBe(`https://${config.host}/prefix/object%20%3F%23%25.txt`);
          return new Response(null, { status: 204 });
        },
      });

      await client.objectDelete(`https://${config.host}/prefix/object%20%3F%23%25.txt`);
    });
  });

  describe('objectMove', () => {
    test('copies then deletes the source object', async () => {
      const requests: Request[] = [];
      const client = new AlicloudClientOss20190517(config, {
        fetch: async (input, init) => {
          const request = new Request(input, init);
          requests.push(request);
          return new Response(null, { status: 200 });
        },
      });

      await client.objectMove({ source: 'source.txt', target: 'target.txt' });

      expect(requests).toHaveLength(2);
      expect(requests[0]?.method).toBe('PUT');
      expect(requests[0]?.headers.get('x-oss-copy-source')).toBe(`/${config.bucket}/source.txt`);
      expect(requests[1]?.method).toBe('DELETE');
      expect(new URL(requests[1]!.url).pathname).toBe('/source.txt');
    });
  });

  describe('doRequest', () => {
    test('uses an encoded key and parses JSON with a charset parameter', async () => {
      const fetchMock: NonNullable<SdkHttpOptions['fetch']> = async (input, init) => {
        const request = new Request(input, init);
        expect(request.url).toBe(`https://${config.host}/prefix/object%20%3F%23%25.txt`);
        return Response.json(
          { Code: 'OK', object: 'prefix/object ?#%.txt' },
          {
            headers: { 'content-type': 'application/json; charset=utf-8' },
          },
        );
      };

      const client = new AlicloudClientOss20190517(config, { fetch: fetchMock });
      const result = await client.doRequest({
        method: 'DELETE',
        object: 'prefix/object ?#%.txt',
      });

      expect(result).toEqual({ Code: 'OK', object: 'prefix/object ?#%.txt' });
    });

    test('throws SdkExceptionResponse when Code is not OK', async () => {
      const fetchMock: NonNullable<SdkHttpOptions['fetch']> = async () =>
        new Response('<Error><Code>NoSuchKey</Code><Message>The specified key does not exist.</Message></Error>', {
          status: 404,
          headers: { 'content-type': 'application/xml; charset=utf-8' },
        });

      const client = new AlicloudClientOss20190517(config, { fetch: fetchMock });

      expect(
        client.doRequest({
          method: 'DELETE',
          object: 'missing-object',
        }),
      ).rejects.toMatchObject({
        source: 'ALI-OSS',
        operation: 'doRequest',
        message: expect.stringContaining('"errcode":"NoSuchKey"'),
      });
    });
  });
});
