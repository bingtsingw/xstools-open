import { BaseException } from './base';

export class ForbiddenException extends BaseException {
  public constructor(messages?: unknown, code?: string) {
    super(403, messages, code);
  }
}
