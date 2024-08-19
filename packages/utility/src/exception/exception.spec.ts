import { describe, expect, test } from 'bun:test';
import { BaseException } from './base';

describe('exception', () => {
  test('ExceptionBase', () => {
    const e1 = new BaseException(0, 'message', 'NotFoundException');
    expect(e1.status).toBe(0);
    expect(e1.code).toBe('E_NOT_FOUND');
    expect(e1.message).toBe('message');
    expect(e1.getFirstMessage()).toBe('message');

    const e2 = new BaseException(0, 'message', 'ExceptionNotFound');
    expect(e2.status).toBe(0);
    expect(e2.code).toBe('E_NOT_FOUND');
    expect(e2.message).toBe('message');
    expect(e2.getFirstMessage()).toBe('message');

    const e3 = new BaseException(0, null, 'ExceptionNotFound');
    expect(e3.status).toBe(0);
    expect(e3.code).toBe('E_NOT_FOUND');
    expect(e3.message).toBe('Not Found');
    expect(e3.getFirstMessage()).toBe('Not Found');

    const e4 = new BaseException(0, null, 'NotFoundException');
    expect(e4.status).toBe(0);
    expect(e4.code).toBe('E_NOT_FOUND');
    expect(e4.message).toBe('Not Found');
    expect(e4.getFirstMessage()).toBe('Not Found');

    // object message
    const e5 = new BaseException(0, [{ message: 'message in array object' }], 'NotFoundException');
    expect(e5.status).toBe(0);
    expect(e5.code).toBe('E_NOT_FOUND');
    expect(e5.message).toBe('message in array object');
    expect(e5.getFirstMessage()).toBe('message in array object');

    const e6 = new BaseException(0, { message: 'message in object' }, 'NotFoundException');
    expect(e6.status).toBe(0);
    expect(e6.code).toBe('E_NOT_FOUND');
    expect(e6.message).toBe('message in object');
    expect(e6.getFirstMessage()).toBe('message in object');
  });
});
