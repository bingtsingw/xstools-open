import { ApiError } from './ApiError';

export class NetworkError extends ApiError {
  public override readonly _tag = '__XSTOOLS_REQUEST__NETWORK_ERROR' as const;
  static {
    (this.prototype as { _tag: string })._tag = '__XSTOOLS_REQUEST__NETWORK_ERROR';
  }

  public readonly code: string;

  public constructor(props?: { message?: string; code?: string }, options?: { cause?: unknown }) {
    super(props?.message ?? '网络错误', { cause: options?.cause });

    this.code = props?.code ?? '';
  }
}
