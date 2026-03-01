import { isError } from '../../predicate';
import type { ITaggedError } from './createTaggedError';

export function isTaggedError<
  // 1. 定义 E 必须是一个构造函数，且拥有静态 is 方法
  E extends (abstract new (...args: any[]) => any) & { is: (err: unknown) => err is any },
>(err: unknown, constructor?: E): err is typeof constructor extends undefined ? ITaggedError : InstanceType<E> {
  // A. 基础协议检查（未传类时）
  if (constructor === undefined) {
    return isError(err) && typeof (err as any)._tag === 'string';
  }

  // B. 优先调用类自带的静态 is 方法
  if (typeof constructor.is === 'function') {
    return constructor.is(err);
  }

  // C. 兜底逻辑
  return err instanceof (constructor as any);
}
