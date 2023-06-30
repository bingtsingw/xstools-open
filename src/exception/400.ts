import { BaseException } from './base';

export class BadRequestException extends BaseException {
  public constructor(messages?: unknown, code?: string) {
    super(400, messages, code);
  }
}
