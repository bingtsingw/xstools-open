import type { AxiosResponse } from 'axios';
import { ApiError } from './ApiError';

export class ResponseError<T = unknown, D = unknown> extends ApiError {
  public override readonly _tag = '__XSTOOLS_REQUEST__RESPONSE_ERROR' as const;
  static {
    (this.prototype as { _tag: string })._tag = '__XSTOOLS_REQUEST__RESPONSE_ERROR';
  }

  public readonly status: number;
  public readonly code: string;
  public readonly response?: AxiosResponse<T, D>;

  public constructor(
    props: { message: string; status: number; code: string; response?: AxiosResponse<T, D> },
    options?: { cause?: unknown },
  ) {
    super(props.message, { cause: options?.cause });

    this.status = props.status;
    this.code = props.code;
    this.response = props.response;
  }
}
