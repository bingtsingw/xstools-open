import { describe, expect, test } from 'bun:test';
import { createTaggedError } from './createTaggedError';
import { isTaggedError } from './isTaggedError';

// --- 模拟 Pkg A 的定义 ---
const Base_A = createTaggedError<string>('BASE_TAG');
class HttpError_A extends Base_A {
  public override readonly _tag = 'HTTP' as const;
  static {
    (this.prototype as any)._tag = 'HTTP';
  }
}
class NotFound_A extends Base_A {
  public override readonly _tag = '404' as const;
  static {
    (this.prototype as any)._tag = '404';
  }
}

// --- 模拟 Pkg B 的定义 (逻辑完全一致，但内存引用不同) ---
const Base_B = createTaggedError<string>('BASE_TAG');
class HttpError_B extends Base_B {
  public override readonly _tag = 'HTTP' as const;
  static {
    (this.prototype as any)._tag = 'HTTP';
  }
}
class NotFound_B extends Base_B {
  public override readonly _tag = '404' as const;
  static {
    (this.prototype as any)._tag = '404';
  }
}

describe('isTaggedError(不传类)', () => {
  test('return `true` for ITaggedError)', () => {
    const e1 = new NotFound_A('test');
    const e2 = new Base_A('test');
    const e3 = new Error('plain');

    expect(isTaggedError(e1)).toBe(true); // 包含 _tag
    expect(isTaggedError(e2)).toBe(true); // 包含 _tag
    expect(isTaggedError(e3)).toBe(false); // 不包含 _tag
  });

  test("return 'false' for plain objects", () => {
    const e1 = { name: 'Error', message: 'test' };
    const e2 = { name: 'Error', message: 'test', _tag: 'TEST' };

    expect(isTaggedError(e1)).toBe(false);
    expect(isTaggedError(e2)).toBe(false);
  });
});

// 跨包与深度继承极限测试
describe('isTaggedError(传类)', () => {
  test('基础：引用隔离验证', () => {
    // 验证 A 和 B 确实是不同的类引用
    expect(Base_A).not.toBe(Base_B);
    expect(HttpError_A).not.toBe(HttpError_B);
    expect(NotFound_A).not.toBe(NotFound_B);

    expect(new Base_A('test') instanceof Base_B).toBe(false);
    expect(new NotFound_A('test') instanceof NotFound_B).toBe(false);
  });

  test('isTaggedError: 跨包验证', () => {
    const errA = new NotFound_A('Error from Pkg A');

    expect(isTaggedError(errA)).toBe(true);

    expect(isTaggedError(errA, NotFound_A)).toBe(true);
    expect(isTaggedError(errA, NotFound_B)).toBe(true);

    expect(isTaggedError(errA, Base_A)).toBe(true);
    expect(isTaggedError(errA, Base_B)).toBe(true);

    expect(isTaggedError(errA, HttpError_A)).toBe(false);
    expect(isTaggedError(errA, HttpError_B)).toBe(false);
  });

  test('isTaggedError: 严谨性验证 (防止误判)', () => {
    const baseErr = new Base_A('Base Error');
    const httpErr = new HttpError_A('Http Error');

    // 子类不应该认领父类的实例 (即使 Tag 前缀相似)
    expect(isTaggedError(baseErr, HttpError_A)).toBe(false);
    expect(isTaggedError(baseErr, HttpError_B)).toBe(false);
    expect(isTaggedError(httpErr, NotFound_A)).toBe(false);
    expect(isTaggedError(httpErr, NotFound_B)).toBe(false);

    // 完全无关的 TaggedError
    const OtherBase = createTaggedError('OTHER');
    expect(isTaggedError(httpErr, OtherBase)).toBe(false);
  });
});
