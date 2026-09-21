import { createTaggedError } from '@xstools/utility/error';
import type { SDK_CLIENT_NAMES } from './source';

type SdkExceptionSource = SDK_CLIENT_NAMES | 'UTILS';

/**
 * SDK 异常。`source` / `operation` 标识调用方。
 *
 * @example
 * throw new SdkException({ source: 'DINGTALK', operation: 'doRequest', message: 'failed' });
 */
export class SdkException extends createTaggedError<string>('__XSTOOLS_SDK__EXCEPTION') {
  public readonly source: SdkExceptionSource;
  public readonly operation: string;

  public constructor(
    props: { source: SdkExceptionSource; operation: string; message: string },
    options?: { cause?: unknown },
  ) {
    super(props.message, options);

    this.source = props.source;
    this.operation = props.operation;
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
