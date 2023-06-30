import { BaseException } from './base';

export class NotFoundException extends BaseException {
  public constructor(messages: unknown, code?: string) {
    super(404, messages, code);
  }
}
