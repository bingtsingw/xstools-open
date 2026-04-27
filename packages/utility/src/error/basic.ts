import { createTaggedError } from './factory';

export class LogicError extends createTaggedError('__XSTOOLS_UTILITY__LOGIC_ERROR') {
  public constructor(message = 'LOGIC_ERROR') {
    super(message);
  }
}

export class AbortError extends createTaggedError('__XSTOOLS_UTILITY__ABORT_ERROR') {
  public constructor(message = 'ABORT_ERROR') {
    super(message);
  }
}

export class ParamError extends createTaggedError('__XSTOOLS_UTILITY__PARAM_ERROR') {
  public constructor(message = 'PARAM_ERROR') {
    super(message);
  }
}

export class TimeoutError extends createTaggedError('__XSTOOLS_UTILITY__TIMEOUT_ERROR') {
  public constructor(message = 'TIMEOUT_ERROR') {
    super(message);
  }
}
