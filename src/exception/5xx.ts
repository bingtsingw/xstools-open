import { BaseException } from './base';

export class ServerErrorException extends BaseException {
  public constructor(message: string, code = 'ServerErrorException') {
    super(500, message, code);
  }
}
