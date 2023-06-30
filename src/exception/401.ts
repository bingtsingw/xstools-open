import { BaseException } from './base';

export class UnauthorizedException extends BaseException {
  public constructor(messages?: unknown, code?: string) {
    super(401, messages, code);
  }
}
