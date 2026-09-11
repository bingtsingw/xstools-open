import { SdkExceptionResponse, type SDK_CLIENT_NAMES } from '../../_errors';
import { checkResponseError, formatResponseErrorMessage, SdkHttp, type SdkHttpOptions } from '../../_transport';
import { isErrorAlicloudCode } from '../_shared/response';
import { parseXML } from '../../_utils/xml';
import type { Alicloud } from '../types';
import { getOssObjectKey, getOssObjectUrl } from './object';
import { signOss } from './signOss';

export interface RequestOssOption {
  method: 'PUT' | 'DELETE';
  object: string;
  body?: ArrayBuffer | Uint8Array;
  headers?: Record<string, string>;
}

export class RequestOss {
  #config: Alicloud.Oss.ClientConfig;
  #http: SdkHttp;
  #clientName: SDK_CLIENT_NAMES;

  public constructor(clientName: SDK_CLIENT_NAMES, config: Alicloud.Oss.ClientConfig, http?: SdkHttpOptions) {
    this.#config = config;
    this.#clientName = clientName;
    this.#http = new SdkHttp(http);
  }

  public async doRequest<T>({ method, object, body, headers }: RequestOssOption): Promise<T> {
    const objectKey = getOssObjectKey(object);
    const url = getOssObjectUrl(this.#config.host, objectKey);

    const response = await this.#http.request(url, {
      method,
      headers: signOss({ config: this.#config, method, object: objectKey, headers }),
      body: body as BodyInit | undefined,
    });

    return this.#getResponse<T>(response);
  }

  async #getResponse<T>(response: Response): Promise<T> {
    let data: unknown = null;

    const mediaType = response.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
    if (mediaType === 'application/xml') {
      data = parseXML(await response.text());
    } else if (mediaType === 'application/json') {
      data = (await response.json()) as object;
    } else {
      data = await response.text();
    }

    const error = checkResponseError(response, data, isErrorAlicloudCode);

    if (error) {
      throw new SdkExceptionResponse({
        source: this.#clientName,
        method: '#getResponse',
        message: formatResponseErrorMessage(error),
      });
    }

    return data as T;
  }
}
