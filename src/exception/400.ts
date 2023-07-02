import { BaseException } from './base';

export class BadRequestException extends BaseException {
  public constructor(messages?: unknown, code = 'BadRequestException') {
    super(400, messages, code);
  }
}
