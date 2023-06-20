import { BaseException } from './base';

export class NotFoundException extends BaseException {
  public constructor(message = '资源不存在') {
    super(message);
    this.name = 'NotFoundException';
  }
}
