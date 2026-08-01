import { get } from '../object';
import { caseSnake, caseStart } from '../string';

/**
 * @deprecated 整个Exception模块将在下个大版本废弃，目前是为了兼容性还留在包里.
 */
export class BaseException extends Error {
  public status: number;
  public code: string;
  public override message: string;

  #_messages: unknown;

  public constructor(status: number, messages: unknown, code: string) {
    super();
    this.status = status;

    const normalizedCode = caseStart(code.replace(/^Exception|Exception$/, ''));
    this.code = caseSnake(`E ${normalizedCode}`).toUpperCase();

    this.#_messages = messages ?? normalizedCode;
    this.message = this.getFirstMessage();
  }

  public getFirstMessage(): string {
    const messages = this.#_messages;

    if (typeof messages === 'string') {
      return messages;
    }

    if (Array.isArray(messages) && messages.length > 0) {
      let message = messages[0];
      if (typeof message === 'string') {
        return message;
      }

      message = get(message, 'message', '');
      if (typeof message === 'string') {
        return message;
      }
    }

    const message = get(messages, 'message', '');
    if (typeof message === 'string') {
      return message;
    }

    return '';
  }
}
