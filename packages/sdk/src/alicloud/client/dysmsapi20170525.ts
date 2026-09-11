import { mapValues } from '@xstools/utility/object';
import { removeEmoji } from '@xstools/utility/string';
import type { SdkHttpOptions } from '../../_transport';
import { ALI_DYSMS } from '../../_errors';
import { RequestAcs, type RequestAcsOption } from '../request';
import type { Alicloud } from '../types';

export class AlicloudClientDysmsapi20170525 {
  public static readonly NAME = ALI_DYSMS;

  #request: RequestAcs;

  public constructor(config: Alicloud.ClientConfig, http?: SdkHttpOptions) {
    this.#request = new RequestAcs(
      AlicloudClientDysmsapi20170525.NAME,
      {
        accessKeyId: config.accessKeyId,
        accessKeySecret: config.accessKeySecret,
        endpoint: 'dysmsapi.aliyuncs.com',
        version: '2017-05-25',
      },
      http,
    );
  }

  public async doRequest<T>(requestOption: RequestAcsOption): Promise<T> {
    return this.#request.doRequest(requestOption);
  }

  public async sendSms(input: Alicloud.Dysms.Send): Promise<void> {
    await this.#request.doRequest({
      method: 'GET',
      action: 'SendSms',
      params: mapValues(input, (value) => removeEmoji(value)),
      retry: 0,
    });
  }
}
