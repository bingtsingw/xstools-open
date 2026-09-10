import type { SdkHttpOptions } from '../_transport';
import { XCLOUD } from '../_errors';
import type { XcloudRequestConfig, XcloudRequestOption } from './request';
import { XcloudRequest } from './request';
import type { Xcloud } from './types';

export class XcloudClient {
  public static readonly NAME = XCLOUD;

  #request: XcloudRequest;

  public constructor(requestConfig: XcloudRequestConfig, http?: SdkHttpOptions) {
    this.#request = new XcloudRequest(XcloudClient.NAME, requestConfig, http);
  }

  public async doRequest<T>(requestOption: XcloudRequestOption): Promise<{ data: T }> {
    return this.#request.doRequest<T>(requestOption);
  }

  public async geoIpToLocation({ ip }: Xcloud.GeoIpToLocationInput): Promise<string> {
    const res = await this.#request.post<{ location: string }>('geo/ipToLocation', { ip });

    return res.data.location;
  }

  public async canvasDraw({ templateKey, templateParam }: Xcloud.CanvasDrawInput): Promise<string> {
    const res = await this.#request.post<{ url: string }>(`canvas/draw`, { key: templateKey, params: templateParam });

    return res.data.url;
  }

  public async citySearch({ name }: Xcloud.CitySearchInput): Promise<Xcloud.CitySearchOutput | null> {
    const res = await this.#request.get<Xcloud.CitySearchOutput | null>('city/search', { params: { name } });

    return res.data;
  }
}
