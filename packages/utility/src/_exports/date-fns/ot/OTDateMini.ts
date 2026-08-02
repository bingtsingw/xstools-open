import { parseOffset } from '../../../datetime';
import { ParamError } from '../../../error';

type DateComponents = [
  year: number,
  month: number,
  date?: number,
  hours?: number,
  minutes?: number,
  seconds?: number,
  ms?: number,
];

type OTDateConstructorParams =
  | [offset: string]
  | [value: string | number | Date, offset: string]
  | [...DateComponents, offset: string];

const constructFromSymbol = Symbol.for('constructDateFrom');

/**
 * Fixed-offset date class (mini). Component getters/setters operate in the
 * given UTC offset without Intl or system time zone. Does not implement
 * custom formatters.
 *
 * @param args - Date parts / timestamp / string / Date, with fixed offset as the last argument
 *
 * @example
 * new OTDateMini(2000, 0, 1, '+08:00').toISOString() // => '1999-12-31T16:00:00.000Z'
 *
 * @throws {ParamError} When offset is missing or invalid
 *
 * @see https://github.com/date-fns/tz (offset-only adaptation)
 */
export class OTDateMini extends Date {
  public static ot(offset: string, ...args: Array<number | string | Date>): OTDateMini {
    return new OTDateMini(...([...args, offset] as OTDateConstructorParams));
  }

  public timeZone: string;
  public offsetMinutes: number;
  public internal: Date;

  public constructor(...args: OTDateConstructorParams) {
    super();

    const list = [...args] as unknown[];
    if (list.length === 0 || typeof list[list.length - 1] !== 'string') {
      throw new ParamError('OTDateMini requires a fixed UTC offset');
    }

    const offset = list.pop() as string;
    this.timeZone = offset;
    this.offsetMinutes = parseOffset(offset);
    this.internal = new Date(0);

    if (list.length === 0) {
      this.setTime(Date.now());
      return;
    }

    if (list.length === 1) {
      const value = list[0] as string | number | Date;
      this.setTime(typeof value === 'string' ? Number(new Date(value)) : Number(value));
      return;
    }

    const components = list as DateComponents;
    const wall = Date.UTC(
      components[0],
      components.length > 1 ? (components[1] as number) : 0,
      components.length > 2 ? (components[2] as number) : 1,
      ...(components.slice(3) as number[]),
    );
    this.setTime(wall - this.offsetMinutes * 60_000);
  }

  public withOffset(offset: string): OTDateMini {
    return new OTDateMini(Number(this), offset);
  }

  public override getTimezoneOffset(): number {
    return -this.offsetMinutes;
  }

  public override setTime(time: number): number {
    Date.prototype.setTime.call(this, time);
    syncToInternal(this);
    return Number(this);
  }

  public [constructFromSymbol](date: Date | number | string): OTDateMini {
    return new OTDateMini(Number(new Date(date)), this.timeZone);
  }
}

const syncToInternal = (date: OTDateMini): void => {
  date.internal.setTime(Number(date) + date.offsetMinutes * 60_000);
};

const syncFromInternal = (date: OTDateMini): void => {
  const wall = Date.UTC(
    date.internal.getUTCFullYear(),
    date.internal.getUTCMonth(),
    date.internal.getUTCDate(),
    date.internal.getUTCHours(),
    date.internal.getUTCMinutes(),
    date.internal.getUTCSeconds(),
    date.internal.getUTCMilliseconds(),
  );
  Date.prototype.setTime.call(date, wall - date.offsetMinutes * 60_000);
};

const re = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((method) => {
  if (!re.test(method)) return;

  const utcMethod = method.replace(re, '$1UTC');
  const dateProto = Date.prototype as unknown as Record<string, unknown>;
  if (typeof dateProto[utcMethod] !== 'function') return;

  const otProto = OTDateMini.prototype as unknown as Record<string, unknown>;

  if (method.startsWith('get')) {
    otProto[method] = function (this: OTDateMini) {
      const getter = (this.internal as unknown as Record<string, (() => number) | undefined>)[utcMethod];
      return getter!.call(this.internal);
    };
  } else {
    otProto[method] = function (this: OTDateMini, ...setterArgs: number[]) {
      const setter = dateProto[utcMethod] as (this: Date, ...a: number[]) => number;
      setter.apply(this.internal, setterArgs);
      syncFromInternal(this);
      return Number(this);
    };

    otProto[utcMethod] = function (this: OTDateMini, ...setterArgs: number[]) {
      const setter = dateProto[utcMethod] as (this: Date, ...a: number[]) => number;
      setter.apply(this, setterArgs);
      syncToInternal(this);
      return Number(this);
    };
  }
});
