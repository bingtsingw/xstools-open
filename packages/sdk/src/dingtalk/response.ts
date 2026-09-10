import { getResponseStatus, type SdkIsError } from '../_transport';

/** DingTalk: HTTP failure, or a non-zero errcode. */
export const isErrorDingtalk: SdkIsError = ({ response, data }) => {
  if (!response.ok) {
    return getResponseStatus(response);
  }

  const body = data as Record<string, unknown> | undefined;
  if (body && body['errcode'] !== 0) {
    return {
      ...getResponseStatus(response),
      errcode: body['errcode'],
      errmsg: body['errmsg'],
    };
  }

  return null;
};
