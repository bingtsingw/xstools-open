import { describe, expect, test } from 'bun:test';
import { SdkExceptionResponse } from '../_errors';
import { DingTalkClient } from './client';
import type { DingTalkRequestOption } from './index';

describe('DingTalkClient', () => {
  describe('customRobotsSendGroupMessages', () => {
    test('throws SdkExceptionResponse when errcode is not zero', async () => {
      const fetchMock = async () =>
        Response.json(
          { errcode: 40001, errmsg: 'invalid token' },
          { status: 200, headers: { 'content-type': 'application/json' } },
        );

      const client = new DingTalkClient({ fetch: fetchMock });

      expect(
        client.customRobotsSendGroupMessages({
          accessToken: 'token_test',
          secret: 'secret_test',
          message: { msgtype: 'text', text: { content: 'hello' } },
        }),
      ).rejects.toThrow(SdkExceptionResponse);
    });

    test('returns true when errcode is zero', async () => {
      const fetchMock = async () =>
        Response.json({ errcode: 0, errmsg: 'ok' }, { status: 200, headers: { 'content-type': 'application/json' } });

      const client = new DingTalkClient({ fetch: fetchMock });
      const result = await client.customRobotsSendGroupMessages({
        accessToken: 'token_test',
        secret: 'secret_test',
        message: { msgtype: 'text', text: { content: 'hello' } },
      });

      expect(result).toBe(true);
    });

    test('signs and sends the robot payload', async () => {
      const timestamp = 1_700_000_000_000;
      const message = { msgtype: 'text' as const, text: { content: 'hello' } };
      const originalNow = Date.now;
      Date.now = () => timestamp;

      try {
        const client = new DingTalkClient({
          fetch: async (input, init) => {
            const request = new Request(input, init);

            expect(request.method).toBe('POST');
            expect(request.url).toBe(
              'https://oapi.dingtalk.com/robot/send?access_token=token_test&timestamp=1700000000000&sign=hSZyoq%2FNgRh6NCxASyVJbIvgj%2BfQxGurWwhNKKMq%2F4M%3D',
            );
            expect(await request.json()).toEqual(message);

            return Response.json({ errcode: 0, errmsg: 'ok' });
          },
        });

        expect(
          client.customRobotsSendGroupMessages({
            accessToken: 'token_test',
            secret: 'secret_test',
            message,
          }),
        ).resolves.toBe(true);
      } finally {
        Date.now = originalNow;
      }
    });
  });

  describe('doRequest', () => {
    test('calls an arbitrary GET endpoint with query parameters', async () => {
      const request: DingTalkRequestOption = {
        method: 'GET',
        path: '/v1.0/custom',
        params: { cursor: 10 },
      };
      const client = new DingTalkClient({
        fetch: async (input, init) => {
          const received = new Request(input, init);

          expect(received.method).toBe('GET');
          expect(received.url).toBe('https://oapi.dingtalk.com/v1.0/custom?cursor=10');

          return Response.json({ errcode: 0, value: 'ok' });
        },
      });

      expect(client.doRequest<{ errcode: number; value: string }>(request)).resolves.toEqual({
        errcode: 0,
        value: 'ok',
      });
    });

    test('throws when a 2xx response has no content-type', async () => {
      const client = new DingTalkClient({
        fetch: async () => new Response('{"errcode":0}', { status: 200 }),
      });

      expect(client.doRequest({ method: 'GET', path: '/v1.0/custom' })).rejects.toMatchObject({
        message: 'Content-Type Invalid',
      });
    });
  });
});
