import { SdkException, SdkExceptionInternalError, SdkExceptionResponse, type SDK_CLIENT_NAMES } from '../_errors';

/** HTTP 管道日志目前固定为 `#getResponse`。业务方法名、console.info、error.log 字段会整份 log 方案一起改，见 `docs/response.md`。 */
const GET_RESPONSE_METHOD = '#getResponse';
const DETAIL_LIMIT = 2048;

interface SdkResponseErrorInfo {
  status: number;
  statusText: string;
  errcode?: unknown;
  errmsg?: unknown;
  detail?: unknown;
  requestId?: unknown;
}

export type SdkIsError = (input: {
  response: Response;
  data: unknown;
}) => SdkResponseErrorInfo | null | undefined | false;

/**
 * Pick HTTP `status` and `statusText` for vendor `isError*` adapters.
 *
 * @example responseStatus(response);
 */
export const responseStatus = (response: Response): Pick<SdkResponseErrorInfo, 'status' | 'statusText'> => ({
  status: response.status,
  statusText: response.statusText,
});

/**
 * Read JSON from an HTTP response. Empty and 204 bodies are `undefined`;
 * non-2xx parse failures return the raw text.
 *
 * @example await readJsonBody(response);
 * @throws {SyntaxError} 2xx body is not JSON.
 */
export const readJsonBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();

  if (!text.trim()) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch (cause) {
    if (!response.ok) {
      return text;
    }

    throw cause;
  }
};

/**
 * Require a JSON Content-Type on 2xx. Non-2xx skips the header check so gateway HTML still becomes HTTP error.
 *
 * @example await readJsonContent(response, 'DINGTALK');
 * @throws {SdkExceptionResponse} 2xx response has a missing or non-JSON Content-Type.
 * @throws {SyntaxError} 2xx body is not JSON.
 */
export const readJsonContent = async (response: Response, source: SDK_CLIENT_NAMES): Promise<unknown> => {
  if (response.ok) {
    const contentType = response.headers.get('content-type');
    if (!contentType) {
      throw new SdkExceptionResponse({
        source,
        method: GET_RESPONSE_METHOD,
        message: 'Content-Type Invalid',
      });
    }

    if (!contentType.includes('application/json')) {
      throw new SdkExceptionResponse({
        source,
        method: GET_RESPONSE_METHOD,
        message: 'Content-Type Unsupported',
      });
    }
  }

  return readJsonBody(response);
};

interface GetResponseInput<T> {
  request: () => Promise<Response>;
  source: SDK_CLIENT_NAMES;
  isError: SdkIsError;
  read: (response: Response) => Promise<unknown>;
  map?: (data: unknown) => T;
}

/**
 * Send a vendor HTTP request then interpret the response: read body, fail every non-2xx, then business codes.
 *
 * @example await getResponse({ request: () => http.request(url, init), source, isError, read: readJsonBody });
 * @throws {SdkExceptionResponse} Non-2xx HTTP status or vendor business error.
 * @throws {SdkExceptionInternalError} Transport failure, 2xx parse failure, or `map` throwing a non-SDK error.
 */
export const getResponse = async <T>(input: GetResponseInput<T>): Promise<T> => {
  const { request, source, isError, read, map } = input;
  let response: Response;

  try {
    response = await request();
  } catch (cause) {
    throw toInternalError(source, cause, 'Request failed');
  }

  const data = await readBody(response, source, read);
  const picked = isError({ response, data }) || null;

  if (!response.ok) {
    throw new SdkExceptionResponse({
      source,
      method: GET_RESPONSE_METHOD,
      message: JSON.stringify(mergeHttpErrorInfo(response, data, picked)),
    });
  }

  if (picked) {
    throw new SdkExceptionResponse({
      source,
      method: GET_RESPONSE_METHOD,
      message: JSON.stringify(picked),
    });
  }

  try {
    return (map ? map(data) : data) as T;
  } catch (cause) {
    throw toInternalError(source, cause, 'Failed to map response data');
  }
};

const readBody = async (
  response: Response,
  source: SDK_CLIENT_NAMES,
  read: (response: Response) => Promise<unknown>,
): Promise<unknown> => {
  try {
    return await read(response);
  } catch (cause) {
    if (SdkException.is(cause)) {
      throw cause;
    }

    if (!response.ok) {
      return undefined;
    }

    throw toInternalError(source, cause, 'Failed to read response body');
  }
};

const mergeHttpErrorInfo = (
  response: Response,
  data: unknown,
  picked: SdkResponseErrorInfo | null,
): SdkResponseErrorInfo => {
  const info: SdkResponseErrorInfo = {
    ...picked,
    ...responseStatus(response),
  };

  if (!hasVendorFields(picked) && data !== undefined && data !== null && !isBinaryBody(data)) {
    const detail = stringifyDetail(data);
    if (detail !== undefined) {
      info.detail = detail;
    }
  }

  return info;
};

const hasVendorFields = (picked: SdkResponseErrorInfo | null): boolean => {
  if (!picked) {
    return false;
  }

  return (
    picked.errcode !== undefined ||
    picked.errmsg !== undefined ||
    picked.detail !== undefined ||
    picked.requestId !== undefined
  );
};

const isBinaryBody = (data: unknown): boolean => {
  if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
    return true;
  }

  if (typeof Blob !== 'undefined' && data instanceof Blob) {
    return true;
  }

  return Buffer.isBuffer(data);
};

const stringifyDetail = (data: unknown): string | undefined => {
  if (typeof data === 'string') {
    return truncateDetail(data);
  }

  try {
    return truncateDetail(JSON.stringify(data));
  } catch {
    return undefined;
  }
};

const truncateDetail = (text: string): string => {
  if (text.length <= DETAIL_LIMIT) {
    return text;
  }

  return text.slice(0, DETAIL_LIMIT);
};

const toInternalError = (source: SDK_CLIENT_NAMES, cause: unknown, fallback: string): never => {
  if (SdkException.is(cause)) {
    throw cause;
  }

  throw new SdkExceptionInternalError(
    {
      source,
      method: GET_RESPONSE_METHOD,
      message: cause instanceof Error ? cause.message : fallback,
    },
    { cause },
  );
};
