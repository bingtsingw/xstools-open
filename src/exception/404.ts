import { BaseException } from './base';

export class NotFoundException extends BaseException {
  public constructor(message?: string, code?: string) {
    super(404, message, code);
  }
}

export class RouteNotFoundException extends BaseException {
  public constructor(method: string, path: string, code?: string) {
    super(404, `Cannot ${method}:${path}`, code);
  }
}
