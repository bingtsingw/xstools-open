type DateConstructorParams =
  | [] // new Date()
  | [value: string | number | Date] // 时间戳/字符串/Date对象
  | [year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number]; // 年月日时分秒毫秒

/**
 * UTC date class. It maps getters and setters to corresponding UTC methods,
 * forcing all calculations in the UTC time zone.
 *
 * Combined with date-fns, it allows using the class the same way as
 * the original date class.
 *
 * @see https://github.com/date-fns/utc
 */
export class UTCDate extends Date {
  public constructor(...args: DateConstructorParams) {
    super();

    const length: number = args.length;

    switch (length) {
      case 0:
        this.setTime(Date.now());
        break;
      case 1:
        this.setTime(typeof args[0] === 'string' ? Number(new Date(args[0])) : (args[0] as number));
        break;
      default:
        this.setTime(Date.UTC(...(args as Parameters<DateConstructor['UTC']>)));
    }
  }

  public override getTimezoneOffset() {
    return 0;
  }
}

const re = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((method) => {
  if (re.test(method)) {
    const utcMethod = (Date.prototype as any)[method.replace(re, '$1UTC')];
    if (utcMethod) (UTCDate.prototype as any)[method] = utcMethod;
  }
});
