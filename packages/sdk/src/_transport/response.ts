export interface SdkResponseErrorInfo {
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

export const getResponseStatus = (response: Response): Pick<SdkResponseErrorInfo, 'status' | 'statusText'> => ({
  status: response.status,
  statusText: response.statusText,
});

/** Read JSON from an HTTP response without throwing on 204 or empty body. */
export const readJsonBody = async <T = unknown>(response: Response): Promise<T | undefined> => {
  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();

  if (!text.trim()) {
    return undefined;
  }

  return JSON.parse(text) as T;
};

export const formatResponseErrorMessage = (error: SdkResponseErrorInfo): string => {
  return JSON.stringify(error);
};

export const checkResponseError = (
  response: Response,
  data: unknown,
  isError: SdkIsError,
): SdkResponseErrorInfo | null => {
  const error = isError({ response, data });

  return error || null;
};

/** Xcloud and other JSON APIs: HTTP not ok */
export const isErrorHttpNotOk: SdkIsError = ({ response }) => {
  if (!response.ok) {
    return getResponseStatus(response);
  }

  return null;
};
