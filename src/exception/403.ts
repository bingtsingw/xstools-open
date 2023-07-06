import { BaseException } from './base';

export class ForbiddenException extends BaseException {
  public constructor(messages?: unknown, code = 'ForbiddenException') {
    super(403, messages, code);
  }
}

export class NeedVipException extends BaseException {
  public constructor(messages?: unknown, code = 'NeedVip') {
    super(403, messages, code);
  }
}
