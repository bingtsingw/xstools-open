import { createHmac } from 'crypto';
import type { SdkHttpOptions } from '../_transport';
import { DINGTALK } from '../_errors';
import { DingTalkRequest, type DingTalkRequestOption } from './request';
import type { DingTalk } from './types';

export class DingTalkClient {
  public static readonly NAME = DINGTALK;

  #request: DingTalkRequest;

  public constructor(http?: SdkHttpOptions) {
    this.#request = new DingTalkRequest(DingTalkClient.NAME, http);
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

    await this.#request.post(
      `/robot/send?access_token=${data.accessToken}&timestamp=${timestamp}&sign=${sign}`,
      data.message,
    );

    return true;
  }
}
