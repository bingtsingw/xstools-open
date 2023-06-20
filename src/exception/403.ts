import { BaseException } from './base';

export class ForbiddenException extends BaseException {
  public constructor(message = '未授权的操作') {
    super(message);
    this.name = 'ForbiddenException';
  }
}
