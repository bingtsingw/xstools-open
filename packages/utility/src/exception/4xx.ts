import { BaseException } from './base';

export class ClientErrorException extends BaseException {
  public constructor(message: string, code = 'ClientErrorException') {
    super(400, message, code);
  }
}
