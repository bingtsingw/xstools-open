import type { SDK_CLIENT_NAMES } from '../../_errors';
import { getResponse, readJsonBody, SdkHttp, type SdkHttpOptions } from '../../_transport';
import { parseXML } from '../../_utils/xml';
import { isErrorAlicloudCode } from '../_utils/isErrorResponse';
import { getOssObjectKey, getOssObjectUrl } from '../_utils/object';
import { signOss } from '../_utils/signOss';
import type { Alicloud } from '../types';

export interface RequestOssOption {
  method: 'PUT' | 'DELETE';
  object: string;
  body?: ArrayBuffer | Uint8Array;
  headers?: Record<string, string>;
}

const readOssBody = async (response: Response): Promise<unknown> => {
  const mediaType = response.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();

  if (mediaType === 'application/xml') {
    const text = await response.text();
    try {
      return parseXML(text);
    } catch (cause) {
      if (!response.ok) {
        return text;
      }

      throw cause;
    }
  }

  if (mediaType === 'application/json') {
    return readJsonBody(response);
  }

  return response.text();
};

export class RequestOss {
  #config: Alicloud.Oss.ClientConfig;
  #http: SdkHttp;
  #clientName: SDK_CLIENT_NAMES;

  public constructor(clientName: SDK_CLIENT_NAMES, config: Alicloud.Oss.ClientConfig, http?: SdkHttpOptions) {
    this.#config = config;
    this.#http = new SdkHttp(http);
    this.#clientName = clientName;
  }

  public async doRequest<T>({ method, object, body, headers }: RequestOssOption): Promise<T> {
    const objectKey = getOssObjectKey(object);
    const url = getOssObjectUrl(this.#config.host, objectKey);

    return getResponse<T>({
      request: () =>
        this.#http.request(url, {
          method,
          headers: signOss({ config: this.#config, method, object: objectKey, headers }),
          body: body as BodyInit | undefined,
        }),
      source: this.#clientName,
      isError: isErrorAlicloudCode,
      read: readOssBody,
    });
  }
}
