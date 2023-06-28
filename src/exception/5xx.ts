import { BaseException } from './base';

export class ServerErrorException extends BaseException {
  public constructor(message = '未知服务端错误', code?: string) {
    super(500, message, code);
  }
}
