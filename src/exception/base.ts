import { get } from 'lodash';

export class BaseException extends Error {
  public constructor(message: string) {
    super(message);
    this.message = message;
  }

  public getMessage(): string {
    const message: unknown = this.message;

    if (typeof message === 'string') {
      return message;
    }

    if (Array.isArray(message) && message.length > 0) {
      return typeof message[0] === 'string' ? message[0] : get(message[0], 'message', '');
    }

    return '';
  }
}
