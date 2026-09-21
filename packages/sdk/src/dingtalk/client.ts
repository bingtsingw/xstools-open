import { createHmac } from 'crypto';
import { DINGTALK } from '../_errors';
import type { SdkClientOptions } from '../_utils/sdkClient';
import { DingTalkRequest, type DingTalkRequestOption } from './request';
import type { DingTalk } from './types';

export class DingTalkClient {
  public static readonly NAME = DINGTALK;

  #request: DingTalkRequest;

  public constructor(options?: SdkClientOptions) {
    const { logger: _, ...httpOptions } = options ?? {};
    this.#request = new DingTalkRequest(DingTalkClient.NAME, httpOptions);
  }

  public async doRequest<T>(requestOption: DingTalkRequestOption): Promise<T> {
    return this.#request.doRequest<T>(requestOption);
  }

  /**
   * 自定义机器人发送群消息
   * https://open.dingtalk.com/document/development/custom-robots-send-group-messages
   */
  public async customRobotsSendGroupMessages(data: DingTalk.CustomRobots.SendGroupMessages) {
    const timestamp = Date.now();
    const hmac = createHmac('sha256', data.secret);
    const sign = encodeURIComponent(hmac.update(`${timestamp}\n${data.secret}`).digest('base64'));

    await this.#request.doRequest({
      method: 'POST',
      path: `/robot/send?access_token=${data.accessToken}&timestamp=${timestamp}&sign=${sign}`,
      body: data.message,
    });

    return true;
  }
}
