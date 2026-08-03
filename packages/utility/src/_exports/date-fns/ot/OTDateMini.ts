import { parseOffset, toEpoch } from '../../../date';
import { ParamError } from '../../../error';

type OTDateConstructorParams = [offset: string] | [value: string | number | Date, offset: string];

const constructFromSymbol = Symbol.for('constructDateFrom');

/**
 * Fixed-offset date class (mini). Component getters/setters operate in the
 * given UTC offset without Intl or system time zone. Does not implement
 * custom formatters (`toString` / `toLocale*` still use the host time zone).
 *
 * Constructor requires a fixed offset as the last argument, and optionally a
 * single timestamp / `Date` / strict ISO instant. Date-component arguments
 * (`year, month, ..., offset`) are not supported.
 *
 * Public surface: `offset`, `withOffset`, Date getters/setters /
 * `getTimezoneOffset` / `setTime`, and date-fns `constructDateFrom`. Do not
 * rely on `internal` or `offsetMinutes` (implementation details).
 *
 * @example
 * new OTDateMini(Date.UTC(2000, 0, 1), '+08:00').getHours() // => 8
 * new OTDateMini('2000-01-01T00:00:00.000Z', '+08:00').getHours() // => 8
 *
 * @throws {ParamError} When offset / value is missing or invalid
 *
 * @see https://github.com/date-fns/date-fns/tree/main/pkgs/tz (offset-only adaptation)
 */
export class OTDateMini extends Date {
  public static ot(offset: string, value?: string | number | Date): OTDateMini {
    return value === undefined ? new OTDateMini(offset) : new OTDateMini(value, offset);
  }

  /** Fixed UTC offset string, e.g. `+08:00`. */
  public offset: string;

  /**
   * Offset in minutes (same sign as `offset`).
   *
   * @internal Implementation detail; prefer `offset` / `getTimezoneOffset()`.
   */
  public offsetMinutes: number;

  /**
   * Wall-clock cache encoded in UTC fields. Used by local getters/setters.
   *
   * @internal Do not read or mutate; may change without notice.
   */
  public internal: Date;

  public constructor(...args: OTDateConstructorParams) {
    super();

    const list = [...args] as unknown[];
    if (list.length === 0 || typeof list[list.length - 1] !== 'string') {
      throw new ParamError('OTDateMini requires a fixed UTC offset');
    }

    if (list.length > 2) {
      throw new ParamError('OTDateMini does not support date component arguments');
    }

    const offset = list.pop() as string;
    this.offset = offset;
    this.offsetMinutes = parseOffset(offset);
    this.internal = new Date();

    if (list.length === 0) {
      this.setTime(Date.now());
      return;
    }

    this.setTime(toEpoch(list[0] as string | number | Date));
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
    return new OTDateMini(toEpoch(date), this.offset);
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
