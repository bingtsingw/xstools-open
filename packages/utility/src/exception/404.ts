import { BaseException } from './base';

export class NotFoundException extends BaseException {
  public constructor(messages?: unknown, code = 'NotFoundException') {
    super(404, messages, code);
  }
}
