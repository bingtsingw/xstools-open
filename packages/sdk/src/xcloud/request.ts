import { SdkExceptionResponse, type SDK_CLIENT_NAMES } from '../_errors';
import {
  checkResponseError,
  formatResponseErrorMessage,
  isErrorHttpNotOk,
  readJsonBody,
  SdkHttp,
  type SdkHttpOptions,
  type SdkJsonObject,
} from '../_transport';
import { resolveURL, withQuery, type QueryObject } from '../_utils/url';
import type { Xcloud } from './types';

export type XcloudRequestConfig = Xcloud.ClientConfig;

export type XcloudRequestOption =
  | { method: 'GET'; path: string; params?: QueryObject }
  | { method: 'POST'; path: string; body: SdkJsonObject };

export class XcloudRequest {
  #baseUrl: string;
  #ak: string;
  #http: SdkHttp;
  #clientName: SDK_CLIENT_NAMES;

  public constructor(clientName: SDK_CLIENT_NAMES, config: XcloudRequestConfig, http?: SdkHttpOptions) {
    this.#baseUrl = config.baseUrl;
    this.#ak = config.ak;
    this.#clientName = clientName;
    this.#http = new SdkHttp(http);
  }

  public async post<T>(path: string, body: SdkJsonObject): Promise<{ data: T }> {
    const response = await this.#http.request(resolveURL(this.#baseUrl, path), {
      method: 'POST',
      headers: {
        'Xcloud-Authorization': this.#ak,
      },
      json: body,
    });

    return this.#getResponse<T>(response);
  }

  public async get<T>(path: string, { params }: { params?: QueryObject }): Promise<{ data: T }> {
    let url = resolveURL(this.#baseUrl, path);

    if (params) {
      url = withQuery(url, params);
    }

    const response = await this.#http.request(url, {
      method: 'GET',
      headers: {
        'Xcloud-Authorization': this.#ak,
      },
    });

    return this.#getResponse<T>(response);
  }

  public async doRequest<T>(requestOption: XcloudRequestOption): Promise<{ data: T }> {
    if (requestOption.method === 'GET') {
      return this.get<T>(requestOption.path, { params: requestOption.params });
    }

    return this.post<T>(requestOption.path, requestOption.body);
  }
  async #getResponse<T>(response: Response): Promise<{ data: T }> {
    const httpError = checkResponseError(response, undefined, isErrorHttpNotOk);

    if (httpError) {
      throw new SdkExceptionResponse({
        source: this.#clientName,
        method: '#getResponse',
        message: formatResponseErrorMessage(httpError),
      });
    }

    const contentType = response.headers.get('content-type');
    if (!contentType) {
      throw new SdkExceptionResponse({
        source: this.#clientName,
        method: '#getResponse',
        message: 'Content-Type Invalid',
      });
    }

    if (contentType.includes('application/json')) {
      const data = await readJsonBody(response);

      return data as { data: T };
    }

    throw new SdkExceptionResponse({
      source: this.#clientName,
      method: '#getResponse',
      message: 'Content-Type Unsupported',
    });
  }
}
