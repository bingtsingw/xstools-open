import { get } from '@xstools/utility/object';
import { getResponseStatus, type SdkIsError } from '../../_transport';

/** Aliyun ACS/OSS: HTTP status >= 400, or present Code not OK. */
export const isErrorAlicloudCode: SdkIsError = ({ response, data }) => {
  const errcode = get(data, 'Code') ?? get(data, 'Error.Code');
  const errmsg = get(data, 'Message') ?? get(data, 'Error.Message');

  if (response.status >= 400 || (errcode && errcode !== 'OK')) {
    return { ...getResponseStatus(response), errcode, errmsg };
  }

  return null;
};
