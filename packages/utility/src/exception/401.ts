import { BaseException } from './base';

export class UnauthorizedException extends BaseException {
  public constructor(messages?: unknown, code = 'UnauthorizedException') {
    super(401, messages, code);
  }
}
