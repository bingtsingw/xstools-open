import { createTaggedError } from '@xstools/utility/error';
import type { SDK_CLIENT_NAMES } from './source';

/**
 * `log`用于记录日志、通知运维，`message`用于通知用户(LogicRejected异常时)
 */
export class SdkException extends createTaggedError<string>('__XSTOOLS_SDK__EXCEPTION') {
  public log = '';

  public constructor(
    props: { source: SDK_CLIENT_NAMES | 'UTILS'; method: string; message: string },
    options?: { cause?: unknown },
  ) {
    super(props.message, options);

    this.log = `[XSTOOLS_SDK:${props.source}(${props.method})]: ${this.message}`;
  }
}

/**
 * 主要用于封装在Request中请求第三方接口时，返回的错误信息
 */
export class SdkExceptionResponse extends SdkException {
  public override readonly _tag = '__XSTOOLS_SDK__EXCEPTION_RESPONSE';
  static {
    (this.prototype as { _tag: string })._tag = '__XSTOOLS_SDK__EXCEPTION_RESPONSE';
  }
}

/**
 * 主要用于将错误`message`返回给用户
 */
export class SdkExceptionLogicRejected extends SdkException {
  public override readonly _tag = '__XSTOOLS_SDK__EXCEPTION_LOGIC_REJECTED';
  static {
    (this.prototype as { _tag: string })._tag = '__XSTOOLS_SDK__EXCEPTION_LOGIC_REJECTED';
  }
}

/**
 * 错误信息不返回给用户，仅用来调试
 */
export class SdkExceptionInternalError extends SdkException {
  public override readonly _tag = '__XSTOOLS_SDK__EXCEPTION_INTERNAL_ERROR';
  static {
    (this.prototype as { _tag: string })._tag = '__XSTOOLS_SDK__EXCEPTION_INTERNAL_ERROR';
  }
}
