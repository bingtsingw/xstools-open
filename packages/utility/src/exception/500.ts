import { BaseException } from './base';

export class InternalErrorException extends BaseException {
  public constructor(message: string, code = 'InternalErrorException') {
    super(500, message, code);
  }
}
