import { BaseException } from './base';

export class UnauthorizedException extends BaseException {
  public constructor(message = '账号未登陆') {
    super(message);
    this.name = 'UnauthorizedException';
  }
}
