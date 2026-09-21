import { describe, expect, test } from 'bun:test';
import { isErrorDingtalk } from './isErrorResponse';

describe('isErrorDingtalk', () => {
  test('detects a non-zero errcode', () => {
    const response = new Response(null, { status: 200 });
    expect(isErrorDingtalk({ response, data: { errcode: 40001, errmsg: 'invalid token' } })).toMatchObject({
      errcode: 40001,
    });
  });

  test('ignores non-object bodies so HTTP errors can keep raw text', () => {
    expect(isErrorDingtalk({ response: new Response(null, { status: 502 }), data: 'gateway failure' })).toBeNull();
  });
});
