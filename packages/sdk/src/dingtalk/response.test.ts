import { describe, expect, test } from 'bun:test';
import { isErrorDingtalk } from './response';

describe('isErrorDingtalk', () => {
  test('detects a non-zero errcode', () => {
    const response = new Response(null, { status: 200 });
    expect(isErrorDingtalk({ response, data: { errcode: 40001, errmsg: 'invalid token' } })).toMatchObject({
      errcode: 40001,
    });
  });
});
