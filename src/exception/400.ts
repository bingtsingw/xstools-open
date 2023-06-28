import { BaseException } from './base';

export class BadRequestException extends BaseException {
  public constructor(message?: string, code?: string) {
    super(400, message, code);
  }
}
