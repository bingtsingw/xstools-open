import ky from 'ky';

export type SdkJsonObject = Record<string, unknown>;

export interface SdkHttpOptions {
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  timeout?: number | false;
}

export class SdkHttp {
  #client;

  public constructor(http: SdkHttpOptions = {}) {
    this.#client = ky.create({
      throwHttpErrors: false,
      ...(http.fetch ? { fetch: http.fetch as typeof fetch } : {}),
      timeout: http.timeout ?? 10_000,
    });
  }

  public request(
    url: string,
    init?: {
      method?: string;
      headers?: HeadersInit;
      json?: unknown;
      body?: BodyInit | null;
    },
  ): Promise<Response> {
    return this.#client(url, init);
  }
}
