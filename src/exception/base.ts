import { get, snake, title } from '@bingtsingw/radash';

export class BaseException extends Error {
  public status: number;
  public code: string;
  public message: string;

  /** @internal */
  private _messages: unknown;

  public constructor(status: number, messages: unknown, code: string) {
    super();
    this.status = status;

    const normalizedCode = title(code.replace(/Exception$/, ''));
    this.code = snake(`E ${normalizedCode}`).toUpperCase();
    this._messages = messages ?? normalizedCode;
    this.message = this.getFirstMessage();
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
