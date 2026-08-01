import { createTaggedError } from './factory';

/**
 * Domain error for unexpected or invalid program logic.
 */
export class LogicError extends createTaggedError('__XSTOOLS_UTILITY__LOGIC_ERROR') {
  public constructor(message = 'LOGIC_ERROR') {
    super(message);
  }
}

/**
 * Domain error for invalid or missing parameters.
 */
export class ParamError extends createTaggedError('__XSTOOLS_UTILITY__PARAM_ERROR') {
  public constructor(message = 'PARAM_ERROR') {
    super(message);
  }
}

/**
 * Domain error for an aborted or canceled operation.
 *
 * Shares the familiar `AbortError` name with DOM / Web APIs (and es-toolkit),
 * but this is a Tagged Error: identify with `AbortError.is(err)` or
 * `isTaggedError(err, AbortError)`, **NOT** `err.name === 'AbortError'` or a raw
 * `DOMException` from `AbortSignal`.
 */
export class AbortError extends createTaggedError('__XSTOOLS_UTILITY__ABORT_ERROR') {
  public constructor(message = 'ABORT_ERROR') {
    super(message);
  }
}

/**
 * Domain error for an operation that exceeded its time limit.
 *
 * Shares the familiar `TimeoutError` name with DOM / Web APIs (and es-toolkit),
 * but this is a Tagged Error: identify with `TimeoutError.is(err)` or
 * `isTaggedError(err, TimeoutError)`, **NOT** `err.name === 'TimeoutError'` alone.
 */
export class TimeoutError extends createTaggedError('__XSTOOLS_UTILITY__TIMEOUT_ERROR') {
  public constructor(message = 'TIMEOUT_ERROR') {
    super(message);
  }
}
