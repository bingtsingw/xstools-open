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
import { isErrorDingtalk } from './response';

export interface DingTalkRequestOption {
  method: 'GET' | 'POST';
  path: string;
  params?: QueryObject;
  body?: SdkJsonObject;
}

export class DingTalkRequest {
  #baseUrl = 'https://oapi.dingtalk.com';
  #http: SdkHttp;
  #clientName: SDK_CLIENT_NAMES;

  public constructor(clientName: SDK_CLIENT_NAMES, http?: SdkHttpOptions) {
    this.#clientName = clientName;
    this.#http = new SdkHttp(http);
  }

  public async post<T>(path: string, body: SdkJsonObject): Promise<T> {
    return this.doRequest({ method: 'POST', path, body });
  }

  public async doRequest<T>({ method, path, params, body }: DingTalkRequestOption): Promise<T> {
    let url = resolveURL(this.#baseUrl, path);

    if (params) {
      url = withQuery(url, params);
    }

    const response = await this.#http.request(url, {
      method,
      json: body,
    });

    return this.#getResponse<T>(response);
  }

  async #getResponse<T>(response: Response): Promise<T> {
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
      const error = checkResponseError(response, data, isErrorDingtalk);

      if (error) {
        throw new SdkExceptionResponse({
          source: this.#clientName,
          method: '#getResponse',
          message: formatResponseErrorMessage(error),
        });
      }

      return data as T;
    }

    throw new SdkExceptionResponse({
      source: this.#clientName,
      method: '#getResponse',
      message: 'Content-Type Unsupported',
    });
  }
}
