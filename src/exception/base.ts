import { get, replace, snakeCase, startCase } from 'lodash';

export class BaseException extends Error {
  public name: string;
  public message: string;

  private _messages: unknown;
  private _code: string;
  private _status: number;

  public constructor(status: number, messages?: unknown, code?: string) {
    super();
    this._status = status;

    const baseName = startCase(replace(this.name, /Exception$/, ''));

    this._code = snakeCase(`E ${code ? code : baseName}`).toUpperCase();
    this._messages = messages ? messages : baseName;

    this.message = `${this._code}: ${this.getFirstMessage()}`;
    this.name = this.constructor.name;

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

  public getStatus(): number {
    return this._status;
  }
}
