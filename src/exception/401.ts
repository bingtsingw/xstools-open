import { BaseException } from './base';

export class UnauthorizedException extends BaseException {
  public constructor(message = '账号未登陆', code?: string) {
    super(401, message, code);
  }
}
