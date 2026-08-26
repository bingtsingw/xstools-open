import type { AxiosResponse } from 'axios';
import { describe, expect, test } from 'bun:test';
import { ApiError } from './ApiError';
import { ResponseError } from './ResponseError';

const response = {
  data: {
    errors: [
      {
        code: 'I400BR',
        message: 'Bad Request',
        status: 400,
        title: 'Bad Request',
      },
    ],
  },
  status: 400,
} as AxiosResponse<unknown, unknown>;

describe('ResponseError', () => {
  test('sets its tag, name, inheritance, and cause', () => {
    const cause = new Error('cause');
    const error = new ResponseError({ message: 'Bad Request', status: 400, code: 'I400BR' }, { cause });

    expect(error._tag).toBe('__XSTOOLS_REQUEST__RESPONSE_ERROR');
    expect(error.name).toBe('ResponseError');
    expect(error.cause).toBe(cause);
    expect(error).toBeInstanceOf(ResponseError);
    expect(error).toBeInstanceOf(ApiError);
    expect(ResponseError.is(error)).toBe(true);
    expect(ApiError.is(error)).toBe(true);
  });

  test('sets explicit props', () => {
    const error = new ResponseError({
      message: 'Bad Request',
      status: 400,
      code: 'I400BR',
      response,
    });

    expect(error.message).toBe('Bad Request');
    expect(error.status).toBe(400);
    expect(error.code).toBe('I400BR');
    expect(error.response).toBe(response);
  });

  test('allows response to be omitted', () => {
    const error = new ResponseError({ message: 'Bad Request', status: 400, code: 'I400BR' });

    expect(error.response).toBe(undefined);
  });
});
