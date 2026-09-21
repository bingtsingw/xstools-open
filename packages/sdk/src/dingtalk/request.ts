import type { SDK_CLIENT_NAMES } from '../_errors';
import { getResponse, readJsonContent, SdkHttp, type SdkHttpOptions, type SdkJsonObject } from '../_transport';
import { resolveURL, withQuery, type QueryObject } from '../_utils/url';
import { isErrorDingtalk } from './_utils/isErrorResponse';

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

  public async doRequest<T>({ method, path, params, body }: DingTalkRequestOption): Promise<T> {
    let url = resolveURL(this.#baseUrl, path);

    if (params) {
      url = withQuery(url, params);
    }

    return getResponse<T>({
      request: () => this.#http.request(url, { method, json: body }),
      source: this.#clientName,
      isError: isErrorDingtalk,
      read: (response) => readJsonContent(response, this.#clientName),
    });
  }
}
