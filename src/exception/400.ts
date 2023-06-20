import { BaseException } from './base';

export class BadRequestException extends BaseException {
  public constructor(message: any) {
    super(message);
    this.name = 'BadRequestException';
  }
}
