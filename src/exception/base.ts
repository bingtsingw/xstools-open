import { get, replace, snakeCase, startCase } from 'lodash';

export class BaseException extends Error {
  public status: number;
  public code: string;
  public message: string;

  private _messages: unknown;

  public constructor(status: number, messages: unknown, code: string) {
    super();
    this.status = status;

    const normalizedCode = startCase(replace(code, /Exception$/, ''));
    this.code = snakeCase(`E ${normalizedCode}`).toUpperCase();
    this._messages = messages ?? normalizedCode;
    this.message = this.getFirstMessage();

    Error.captureStackTrace(this, this.constructor);
  }

  public getFirstMessage(): string {
    const messages = this._messages;

    if (typeof messages === 'string') {
      return messages;
    }

    if (Array.isArray(messages) && messages.length > 0) {
      return typeof messages[0] === 'string' ? messages[0] : get(messages[0], 'message', '');
    }

    return '';
  }
}
