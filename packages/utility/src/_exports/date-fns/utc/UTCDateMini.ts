type DateConstructorParams =
  | []
  | [value: string | number | Date]
  | [year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number];

/**
 * UTC date class (mini). Maps local getters/setters to UTC counterparts so
 * date-fns calculations run in UTC without relying on the system time zone.
 *
 * Does not override formatter methods (`toString`, etc.).
 *
 * @example
 * new UTCDateMini(1987, 1, 11).getTime() // => Date.UTC(1987, 1, 11)
 *
 * @see https://github.com/date-fns/date-fns/tree/main/pkgs/utc
 */
export class UTCDateMini extends Date {
  public constructor(...args: DateConstructorParams) {
    super();

    if (args.length === 0) {
      this.setTime(Date.now());
      return;
    }

    if (args.length === 1) {
      const value = args[0];
      this.setTime(typeof value === 'string' ? Number(new Date(value)) : Number(value));
      return;
    }

    this.setTime(Date.UTC(...(args as Parameters<DateConstructor['UTC']>)));
  }

  public override getTimezoneOffset() {
    return 0;
  }
}

const re = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((method) => {
  if (re.test(method)) {
    const utcMethod = (Date.prototype as unknown as Record<string, unknown>)[method.replace(re, '$1UTC')];
    if (typeof utcMethod === 'function') {
      (UTCDateMini.prototype as unknown as Record<string, unknown>)[method] = utcMethod;
    }
  }
});
