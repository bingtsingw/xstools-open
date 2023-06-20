import { BaseException } from './base';

export class ClientException extends BaseException {
  public constructor(message = '未知客户端错误') {
    super(message);
    this.name = 'ClientException';
  }
}
