import { BaseException } from './base';

export class ClientErrorException extends BaseException {
  public constructor(message = '未知客户端错误', code?: string) {
    super(400, message, code);
  }
}
