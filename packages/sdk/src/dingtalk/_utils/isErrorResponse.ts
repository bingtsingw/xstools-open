import { responseStatus, type SdkIsError } from '../../_transport';

/** DingTalk: a present non-zero errcode indicates failure. HTTP status is handled by the pipeline. */
export const isErrorDingtalk: SdkIsError = ({ response, data }) => {
  if (data === null || data === undefined || typeof data !== 'object' || Array.isArray(data)) {
    return null;
  }

  const body = data as Record<string, unknown>;
  if (body['errcode'] !== 0) {
    return {
      ...responseStatus(response),
      errcode: body['errcode'],
      errmsg: body['errmsg'],
    };
  }

  return null;
};
