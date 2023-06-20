import { BaseException } from './base';

export class ServerException extends BaseException {
  public constructor(message = '未知服务端错误') {
    super(message);
    this.name = 'ServerException';
  }
}
