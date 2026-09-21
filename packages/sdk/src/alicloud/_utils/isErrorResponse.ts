import { get } from '@xstools/utility/object';
import { responseStatus, type SdkIsError } from '../../_transport';

/** Aliyun ACS/OSS: a present Code other than OK indicates failure. HTTP status is handled by the pipeline. */
export const isErrorAlicloudCode: SdkIsError = ({ response, data }) => {
  const errcode = get(data, 'Code') ?? get(data, 'Error.Code');
  const errmsg = get(data, 'Message') ?? get(data, 'Error.Message');

  if (errcode && errcode !== 'OK') {
    return { ...responseStatus(response), errcode, errmsg };
  }

  return null;
};
