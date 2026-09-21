import { XCLOUD } from '../_errors';
import type { SdkClientOptions } from '../_utils/sdkClient';
import type { XcloudRequestOption } from './request';
import { XcloudRequest } from './request';
import type { Xcloud } from './types';

export class XcloudClient {
  public static readonly NAME = XCLOUD;

  #request: XcloudRequest;

  public constructor(requestConfig: Xcloud.ClientConfig, options?: SdkClientOptions) {
    const { logger: _, ...httpOptions } = options ?? {};
    this.#request = new XcloudRequest(XcloudClient.NAME, requestConfig, httpOptions);
  }

  public async doRequest<T>(requestOption: XcloudRequestOption): Promise<T> {
    return this.#request.doRequest<T>(requestOption);
  }

  public async geoIpToLocation({ ip }: Xcloud.GeoIpToLocationInput): Promise<string> {
    const res = await this.#request.doRequest<{ data: { location: string } }>({
      operation: 'geoIpToLocation',
      method: 'POST',
      path: 'geo/ipToLocation',
      body: { ip },
    });

    return res.data.location;
  }

  public async canvasDraw({ templateKey, templateParam }: Xcloud.CanvasDrawInput): Promise<string> {
    const res = await this.#request.doRequest<{ data: { url: string } }>({
      operation: 'canvasDraw',
      method: 'POST',
      path: 'canvas/draw',
      body: { key: templateKey, params: templateParam },
    });

    return res.data.url;
  }

  public async citySearch({ name }: Xcloud.CitySearchInput): Promise<Xcloud.CitySearchOutput | null> {
    const res = await this.#request.doRequest<{ data: Xcloud.CitySearchOutput | null }>({
      operation: 'citySearch',
      method: 'GET',
      path: 'city/search',
      params: { name },
    });

    return res.data;
  }
}
