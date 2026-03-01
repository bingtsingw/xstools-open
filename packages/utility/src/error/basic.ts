import { createTaggedError } from './factory';

export class AbortError extends createTaggedError('__XSTOOLS_UTILITY__ABORT_ERROR') {
  public constructor(message = 'The operation was aborted') {
    super(message);
  }
}

export class ParamError extends createTaggedError('__XSTOOLS_UTILITY__PARAM_ERROR') {
  public constructor(message = 'The parameter is invalid') {
    super(message);
  }
}

export class TimeoutError extends createTaggedError('__XSTOOLS_UTILITY__TIMEOUT_ERROR') {
  public constructor(message = 'The operation was timed out') {
    super(message);
  }
}
