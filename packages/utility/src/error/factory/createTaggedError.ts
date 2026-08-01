export interface ITaggedError {
  readonly _tag: string;
  readonly message: string;
  readonly stack?: string;
  readonly cause?: unknown;
}

/**
 * Create an Error subclass with a stable `_tag` and static `is()` for cross-bundle identity.
 *
 * Recommended usage — extend the factory result directly:
 *
 * ```ts
 * class ParamError extends createTaggedError('PARAM_ERROR') {}
 * ParamError.is(err); // true for this class and subclasses that keep the tag chain
 * ```
 *
 * Inheritance caveats:
 * - Prefer a single `extends createTaggedError(tag)` leaf class for each tag.
 * - If you introduce an intermediate base and then subclass again, re-declare `_tag`
 *   on the subclass prototype when the subclass needs a distinct tag; otherwise
 *   `Child.is` / parent `is` may not match the way you expect. See factory tests
 *   marked `warning:` for concrete failure modes.
 *
 * @param defaultTag - Stable tag string written on the prototype and instances.
 */
export const createTaggedError = <TTag extends string>(defaultTag: TTag) => {
  type ErrorConstructor = new (...args: any[]) => ITaggedError & Error;

  const Base = class extends Error implements ITaggedError {
    public static is<E extends ErrorConstructor>(this: E, err: unknown): err is InstanceType<E> {
      if (!err || typeof err !== 'object') return false;

      // 1. 同一引用下的快速通道
      if (err instanceof (this as any)) return true;

      // 2. 获取当前类想要匹配的指纹
      const targetTag = (this.prototype as any)?._tag;
      if (!targetTag) return false;

      // 3. 跨包识别：模拟原型链向上回溯
      let currentErrProto = Object.getPrototypeOf(err);
      while (currentErrProto) {
        // 如果当前层级的指纹匹配上了，说明 err 是该类或其子类的实例
        if (currentErrProto._tag === targetTag) {
          return true;
        }
        // 继续往上找
        currentErrProto = Object.getPrototypeOf(currentErrProto);
      }

      return false;
    }

    public _tag: TTag = defaultTag;

    public override readonly cause?: unknown;

    /**
     * @param message 错误消息
     * @param options 包含 cause 的选项对象 (符合 ES2022 标准)
     */
    public constructor(message: string, options?: ErrorOptions) {
      // 1. 调用原生构造函数处理 message 和 cause
      super(message, options);

      // 2. 身份修正: 获取子类类名, 并设置为不可枚举
      const actualProto = new.target.prototype;
      Object.defineProperty(this, 'name', {
        value: actualProto.constructor.name,
        configurable: true,
        enumerable: false,
        writable: true,
      });

      // 3. 显式赋值 cause 确保兼容性
      if (options && 'cause' in options) {
        this.cause = options.cause;
      }

      // 4. 修复原型链 (兼容 ES5/TS 降级编译)
      Object.setPrototypeOf(this, actualProto);

      // 5. 捕获堆栈 (隐藏工厂内部追踪)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, new.target);
      }
    }
  };

  // 2. 关键修复：将 defaultTag 注入原型，让静态 is 方法能通过 this.prototype 访问到
  Base.prototype._tag = defaultTag;

  return Base;
};
