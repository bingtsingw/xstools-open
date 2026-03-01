import { describe, expect, expectTypeOf, test } from 'bun:test';
import { createTaggedError } from './createTaggedError';

// 定义测试用的错误类
class DatabaseError extends createTaggedError('DB_ERROR') {}
class NetworkError extends createTaggedError('NETWORK_ERROR') {}

class HttpException extends createTaggedError<string>('HTTP_EXCEPTION') {
  public readonly code: string;
  public readonly title: string;
  public readonly status: number;

  public constructor(options: { message: string; code: string; title: string; status: number; cause?: unknown }) {
    super(options.message, { cause: options.cause });

    this.code = options.code;
    this.title = options.title;
    this.status = options.status;
  }
}

class HttpExceptionNotFound extends HttpException {
  public override readonly _tag: 'HTTP_EXCEPTION:NOT_FOUND' = 'HTTP_EXCEPTION:NOT_FOUND';
  static {
    (this.prototype as { _tag: string })._tag = 'HTTP_EXCEPTION:NOT_FOUND';
  }

  public constructor({ message, cause }: { message?: string; cause?: unknown }) {
    super({
      message: message ?? `not found`,
      title: 'Not Found',
      code: 'NOT_FOUND',
      status: 404,
      cause,
    });
  }
}

class HttpExceptionBadRequest extends HttpException {
  public override readonly _tag: 'HTTP_EXCEPTION:BAD_REQUEST' = 'HTTP_EXCEPTION:BAD_REQUEST';
  static {
    (this.prototype as { _tag: string })._tag = 'HTTP_EXCEPTION:BAD_REQUEST';
  }

  public constructor({ message, cause }: { message?: string; cause?: unknown }) {
    super({
      message: message ?? `bad request`,
      title: 'Bad Request',
      code: 'BAD_REQUEST',
      status: 400,
      cause,
    });
  }
}

describe('createTaggedError', () => {
  test('正确设置`_tag`和`name`', () => {
    const m1 = 'Connection timeout';
    const e1 = new DatabaseError(m1);
    expect(e1._tag).toBe('DB_ERROR');
    expect(e1.name).toBe('DatabaseError');
    expect(e1.message).toBe(m1);

    const m2 = 'http error';
    const e2 = new HttpException({ message: m2, code: 'HTTP_ERROR', title: 'Http Error', status: 500 });
    expect(e2._tag).toBe('HTTP_EXCEPTION');
    expect(e2.name).toBe('HttpException');
    expect(e2.message).toBe(m2);

    const m3 = 'user not found';
    const e3 = new HttpExceptionNotFound({ message: m3 });
    expect(e3._tag).toBe('HTTP_EXCEPTION:NOT_FOUND');
    expect(e3.name).toBe('HttpExceptionNotFound');
    expect(e3.message).toBe(m3);
  });

  test('静态`is()`方法能够正确识别类型', () => {
    const dbErr = new DatabaseError('db error');
    const netErr = new NetworkError('net error');

    expect(DatabaseError.is(dbErr)).toBe(true);
    expect(NetworkError.is(dbErr)).toBe(false);
    expect(DatabaseError.is(netErr)).toBe(false);
    expect(NetworkError.is(netErr)).toBe(true);
    expect(DatabaseError.is(new Error('plain error'))).toBe(false);
    expect(NetworkError.is(new Error('plain error'))).toBe(false);
  });

  test('warning: 多层继承: `_tag`未设置, `is()`方法识别范围有问题', () => {
    class IS_A extends createTaggedError<string>('IS_A') {}
    class IS_B extends IS_A {}
    class IS_C extends IS_A {}

    const a = new IS_A('a');
    const b = new IS_B('b');
    const c = new IS_C('c');

    expect(IS_A.is(a)).toBe(true);
    expect(IS_A.is(b)).toBe(true);
    expect(IS_A.is(c)).toBe(true);

    expect(IS_B.is(a)).not.toBe(false); // 不应该识别为 IS_B
    expect(IS_B.is(b)).toBe(true);
    expect(IS_B.is(c)).not.toBe(false); // 不应该识别为 IS_B

    expect(IS_C.is(a)).not.toBe(false); // 不应该识别为 IS_C
    expect(IS_C.is(b)).not.toBe(false); // 不应该识别为 IS_C
    expect(IS_C.is(c)).toBe(true);
  });

  test('warning: 多层继承: `_tag`设置, `static`未设置, `is()`方法识别范围有问题', () => {
    class IS_A extends createTaggedError<string>('IS_A') {}
    class IS_B extends IS_A {
      public override readonly _tag: 'IS_B' = 'IS_B';
    }
    class IS_C extends IS_A {
      public override readonly _tag: 'IS_C' = 'IS_C';
    }

    const a = new IS_A('a');
    const b = new IS_B('b');
    const c = new IS_C('c');

    expect(IS_A.is(a)).toBe(true);
    expect(IS_A.is(b)).toBe(true);
    expect(IS_A.is(c)).toBe(true);

    expect(IS_B.is(a)).not.toBe(false); // 不应该识别为 IS_B
    expect(IS_B.is(b)).toBe(true);
    expect(IS_B.is(c)).not.toBe(false); // 不应该识别为 IS_B

    expect(IS_C.is(a)).not.toBe(false); // 不应该识别为 IS_C
    expect(IS_C.is(b)).not.toBe(false); // 不应该识别为 IS_C
    expect(IS_C.is(c)).toBe(true);
  });

  test('warning: 多层继承: `_tag`设置, `static`设置, `is()`方法能够正确识别类型', () => {
    class IS_A extends createTaggedError<string>('IS_A') {}
    class IS_B extends IS_A {
      public override readonly _tag: 'IS_B' = 'IS_B';
      static {
        (this.prototype as { _tag: string })._tag = 'IS_B';
      }
    }
    class IS_C extends IS_A {
      public override readonly _tag: 'IS_C' = 'IS_C';
      static {
        (this.prototype as { _tag: string })._tag = 'IS_C';
      }
    }

    const a = new IS_A('a');
    const b = new IS_B('b');
    const c = new IS_C('c');

    expect(IS_A.is(a)).toBe(true);
    expect(IS_A.is(b)).toBe(true);
    expect(IS_A.is(c)).toBe(true);

    expect(IS_B.is(a)).toBe(false); // 识别正确
    expect(IS_B.is(b)).toBe(true);
    expect(IS_B.is(c)).toBe(false); // 识别正确

    expect(IS_C.is(a)).toBe(false); // 识别正确
    expect(IS_C.is(b)).toBe(false); // 识别正确
    expect(IS_C.is(c)).toBe(true);
  });

  test('多层继承: `_tag`正确配置, `is()`方法能够正确识别类型', () => {
    const httpErr = new HttpException({ message: 'http error', code: 'HTTP_ERROR', title: 'Http Error', status: 500 });
    const httpNotFoundErr = new HttpExceptionNotFound({ message: 'user not found' });
    const httpBadRequestErr = new HttpExceptionBadRequest({ message: 'bad request' });

    expect(HttpException.is(httpErr)).toBe(true);
    expect(HttpException.is(httpNotFoundErr)).toBe(true);
    expect(HttpException.is(httpBadRequestErr)).toBe(true);

    expect(HttpExceptionNotFound.is(httpNotFoundErr)).toBe(true);
    expect(HttpExceptionNotFound.is(httpErr)).toBe(false);
    expect(HttpExceptionNotFound.is(httpBadRequestErr)).toBe(false);

    expect(HttpExceptionBadRequest.is(httpBadRequestErr)).toBe(true);
    expect(HttpExceptionBadRequest.is(httpErr)).toBe(false);
    expect(HttpExceptionBadRequest.is(httpNotFoundErr)).toBe(false);
  });

  test('instanceof', () => {
    const e1 = new DatabaseError('test');
    expect(e1 instanceof Error).toBe(true);
    expect(e1 instanceof DatabaseError).toBe(true);
    expect(e1 instanceof HttpExceptionNotFound).toBe(false);

    const e2 = new HttpException({ message: 'http error', code: 'HTTP_ERROR', title: 'Http Error', status: 500 });
    expect(e2 instanceof Error).toBe(true);
    expect(e2 instanceof HttpException).toBe(true);
    expect(e2 instanceof HttpExceptionNotFound).toBe(false);
    expect(e2 instanceof HttpExceptionBadRequest).toBe(false);

    const e3 = new HttpExceptionNotFound({ message: 'user not found' });
    expect(e3 instanceof Error).toBe(true);
    expect(e3 instanceof HttpException).toBe(true);
    expect(e3 instanceof HttpExceptionNotFound).toBe(true);
    expect(e3 instanceof HttpExceptionBadRequest).toBe(false);

    const e4 = new HttpExceptionBadRequest({ message: 'bad request' });
    expect(e4 instanceof Error).toBe(true);
    expect(e4 instanceof HttpException).toBe(true);
    expect(e4 instanceof HttpExceptionNotFound).toBe(false);
    expect(e4 instanceof HttpExceptionBadRequest).toBe(true);
  });

  test('`cause`正确传递', () => {
    const rootCause = new Error('Root technical error');
    const dbErr = new DatabaseError('Business logic failed', { cause: rootCause });

    expect(dbErr.cause).toBe(rootCause);
  });

  test('多层继承: `cause`正确传递', () => {
    const rootCause = new Error('Root technical error');
    const dbErr = new DatabaseError('Business logic failed', { cause: rootCause });
    const httpErr = new HttpException({
      message: 'http error',
      code: 'HTTP_ERROR',
      title: 'Http Error',
      status: 500,
      cause: dbErr,
    });
    const httpNotFoundErr = new HttpExceptionNotFound({ message: 'user not found', cause: httpErr });

    expect(httpNotFoundErr.cause).toBe(httpErr);
    expect(httpErr.cause).toBe(dbErr);
    expect(dbErr.cause).toBe(rootCause);
  });

  test('`_tag`类型检查', () => {
    expectTypeOf(DatabaseError.prototype._tag).toEqualTypeOf<'DB_ERROR'>();
    expectTypeOf(HttpException.prototype._tag).toEqualTypeOf<string>();
    // @ts-expect-error
    expectTypeOf(HttpException.prototype._tag).toEqualTypeOf<'HTTP_EXCEPTION'>();
    expectTypeOf(HttpExceptionNotFound.prototype._tag).toEqualTypeOf<'HTTP_EXCEPTION:NOT_FOUND'>();

    const e1 = new DatabaseError('test');
    const e2 = new HttpException({ message: 'http error', code: 'HTTP_ERROR', title: 'Http Error', status: 500 });
    const e3 = new HttpExceptionNotFound({ message: 'user not found' });

    expect(e1._tag).toBe('DB_ERROR');
    expect(e2._tag).toBe('HTTP_EXCEPTION');
    expect(e3._tag).toBe('HTTP_EXCEPTION:NOT_FOUND');

    expectTypeOf(e1._tag).toEqualTypeOf<'DB_ERROR'>();
    expectTypeOf(e2._tag).toEqualTypeOf<string>();
    // @ts-expect-error
    expectTypeOf(e2._tag).toEqualTypeOf<'HTTP_EXCEPTION'>();
    expectTypeOf(e3._tag).toEqualTypeOf<'HTTP_EXCEPTION:NOT_FOUND'>();
  });
});

describe('createTaggedError 模拟跨包多实例', () => {
  test('即使类引用不同，is 方法也应该通过 _tag 识别成功', () => {
    // 1. 模拟包 A 产生的类
    const DatabaseError_PkgA = createTaggedError('DB_ERROR');

    // 2. 模拟包 B 产生的类 (代码一模一样，但引用地址不同)
    const DatabaseError_PkgB = createTaggedError('DB_ERROR');

    // 验证：它们确实不是同一个东西
    expect(DatabaseError_PkgA).not.toBe(DatabaseError_PkgB);

    // 3. 创建 PkgA 的实例
    const errFromA = new DatabaseError_PkgA('Connection failed');

    // 4. 模拟交叉识别
    // instanceof 识别失败
    expect(errFromA instanceof DatabaseError_PkgB).toBe(false);

    // 关键：我们的静态 is 方法能够正确识别
    expect(DatabaseError_PkgB.is(errFromA)).toBe(true);
  });

  test('深度子类的跨实例识别', () => {
    class IS_A_PkgA extends createTaggedError<string>('IS_A') {}
    class IS_B_PkgA extends IS_A_PkgA {
      public override readonly _tag: 'IS_B' = 'IS_B';
      static {
        (this.prototype as { _tag: string })._tag = 'IS_B';
      }
    }
    class IS_C_PkgA extends IS_A_PkgA {
      public override readonly _tag: 'IS_C' = 'IS_C';
      static {
        (this.prototype as { _tag: string })._tag = 'IS_C';
      }
    }

    class IS_A_PkgB extends createTaggedError<string>('IS_A') {}
    class IS_B_PkgB extends IS_A_PkgB {
      public override readonly _tag: 'IS_B' = 'IS_B';
      static {
        (this.prototype as { _tag: string })._tag = 'IS_B';
      }
    }
    class IS_C_PkgB extends IS_A_PkgB {
      public override readonly _tag: 'IS_C' = 'IS_C';
      static {
        (this.prototype as { _tag: string })._tag = 'IS_C';
      }
    }

    const A_a = new IS_A_PkgA('a');
    const A_b = new IS_B_PkgA('b');
    const A_c = new IS_C_PkgA('c');

    const B_a = new IS_A_PkgB('a');
    const B_b = new IS_B_PkgB('b');
    const B_c = new IS_C_PkgB('c');

    expect(IS_A_PkgA.is(A_a)).toBe(true);
    expect(IS_A_PkgA.is(A_b)).toBe(true);
    expect(IS_A_PkgA.is(A_c)).toBe(true);
    expect(IS_B_PkgA.is(A_a)).toBe(false);
    expect(IS_B_PkgA.is(A_b)).toBe(true);
    expect(IS_B_PkgA.is(A_c)).toBe(false);
    expect(IS_C_PkgA.is(A_a)).toBe(false);
    expect(IS_C_PkgA.is(A_b)).toBe(false);
    expect(IS_C_PkgA.is(A_c)).toBe(true);

    expect(IS_A_PkgA.is(B_a)).toBe(true);
    expect(IS_A_PkgA.is(B_b)).toBe(true);
    expect(IS_A_PkgA.is(B_c)).toBe(true);
    expect(IS_B_PkgA.is(B_a)).toBe(false);
    expect(IS_B_PkgA.is(B_b)).toBe(true);
    expect(IS_B_PkgA.is(B_c)).toBe(false);
    expect(IS_C_PkgA.is(B_a)).toBe(false);
    expect(IS_C_PkgA.is(B_b)).toBe(false);
    expect(IS_C_PkgA.is(B_c)).toBe(true);
  });
});
