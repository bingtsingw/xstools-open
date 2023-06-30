import { BaseException } from './base';

export class ServerErrorException extends BaseException {
  public constructor(message: string, code?: string) {
    super(500, message, code);
  }
}
