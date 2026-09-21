import { stringify, type ParsedUrlQueryInput } from 'querystring';
import type { SDK_CLIENT_NAMES } from '../../_errors';
import { getResponse, readJsonBody, SdkHttp, type SdkHttpOptions, type SdkJsonObject } from '../../_transport';
import { isErrorAlicloudCode } from '../_utils/isErrorResponse';
import { signV3 } from '../_utils/signV3';

interface Config {
  accessKeyId: string;
  accessKeySecret: string;
  endpoint: string;
  version: string;
}

export interface RequestAcsOption {
  operation?: string;
  action: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  params?: ParsedUrlQueryInput;
  body?: string | SdkJsonObject;
  retry?: number;
}

export class RequestAcs {
  #config: Config;
  #http: SdkHttp;
  #clientName: SDK_CLIENT_NAMES;

  public constructor(clientName: SDK_CLIENT_NAMES, config: Config, http?: SdkHttpOptions) {
    this.#config = config;
    this.#clientName = clientName;
    this.#http = new SdkHttp(http);
  }

  public async doRequest<T>({
    operation = 'doRequest',
    action,
    method,
    headers,
    params,
    body,
    retry,
  }: RequestAcsOption): Promise<T> {
    const url = `https://${this.#config.endpoint}?${stringify(params)}`;

    const requestHeaders = Object.fromEntries(
      Object.entries({
        accept: 'application/json; charset=utf-8',
        'x-acs-action': action,
        'x-acs-version': this.#config.version,
        ...headers,
      }).map(([key, value]) => [key.toLowerCase(), value]),
    );
    const requestBody = body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body);

    if (requestBody !== undefined) {
      requestHeaders['content-type'] ||= 'application/json; charset=utf-8';
    }

    return getResponse<T>({
      request: () =>
        this.#http.request(url, {
          method,
          headers: signV3({
            method,
            url,
            headers: requestHeaders,
            body: requestBody,
            ak: this.#config.accessKeyId,
            sk: this.#config.accessKeySecret,
          }).headers,
          body: requestBody,
          ...(retry === undefined ? {} : { retry }),
        }),
      source: this.#clientName,
      operation,
      isError: isErrorAlicloudCode,
      read: readJsonBody,
    });
  }
}
