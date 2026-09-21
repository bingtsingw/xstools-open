import type { SDK_CLIENT_NAMES } from '../_errors';
import {
  getResponse,
  readJsonContent,
  SdkHttp,
  type SdkHttpOptions,
  type SdkIsError,
  type SdkJsonObject,
} from '../_transport';
import { resolveURL, withQuery, type QueryObject } from '../_utils/url';
import type { Xcloud } from './types';

export type XcloudRequestOption =
  | { operation?: string; method: 'GET'; path: string; params?: QueryObject }
  | { operation?: string; method: 'POST'; path: string; body: SdkJsonObject };

const isErrorXcloud: SdkIsError = () => null;

export class XcloudRequest {
  #baseUrl: string;
  #ak: string;
  #http: SdkHttp;
  #clientName: SDK_CLIENT_NAMES;

  public constructor(clientName: SDK_CLIENT_NAMES, config: Xcloud.ClientConfig, http?: SdkHttpOptions) {
    this.#baseUrl = config.baseUrl;
    this.#ak = config.ak;
    this.#clientName = clientName;
    this.#http = new SdkHttp(http);
  }

  public async doRequest<T>(requestOption: XcloudRequestOption): Promise<{ data: T }> {
    const operation = requestOption.operation ?? 'doRequest';
    let url = resolveURL(this.#baseUrl, requestOption.path);
    const init =
      requestOption.method === 'GET'
        ? { method: 'GET' as const }
        : { method: 'POST' as const, json: requestOption.body };

    if (requestOption.method === 'GET' && requestOption.params) {
      url = withQuery(url, requestOption.params);
    }

    return getResponse<{ data: T }>({
      request: () =>
        this.#http.request(url, {
          ...init,
          headers: {
            'Xcloud-Authorization': this.#ak,
          },
        }),
      source: this.#clientName,
      operation,
      isError: isErrorXcloud,
      read: (response) => readJsonContent(response, this.#clientName, operation),
    });
  }
}
