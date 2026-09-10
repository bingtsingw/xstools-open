import { SdkException, SdkExceptionInternalError } from '../_errors';

/** Normalize local utility failures while preserving existing SDK errors and their context. */
export const utilsError = (method: string, cause: unknown): SdkException => {
  if (SdkException.is(cause)) {
    return cause;
  }
  return new SdkExceptionInternalError(
    { source: 'UTILS', method, message: cause instanceof Error ? cause.message : 'Unknown utility error' },
    { cause },
  );
};
