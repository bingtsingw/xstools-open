import { ApiError } from './ApiError';

export class CanceledError extends ApiError {
  public override readonly _tag = '__XSTOOLS_REQUEST__CANCELED_ERROR' as const;
  static {
    (this.prototype as { _tag: string })._tag = '__XSTOOLS_REQUEST__CANCELED_ERROR';
  }

  public readonly code: string;

  public constructor(props?: { message?: string; code?: string }, options?: { cause?: unknown }) {
    super(props?.message ?? '请求已取消', { cause: options?.cause });

    this.code = props?.code ?? '';
  }
}
