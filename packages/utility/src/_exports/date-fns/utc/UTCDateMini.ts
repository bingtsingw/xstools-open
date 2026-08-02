import { toEpoch } from '../../../date';
import { ParamError } from '../../../error';

type UTCDateConstructorParams = [] | [value: string | number | Date];

/**
 * UTC date class (mini). Maps local getters/setters to UTC counterparts so
 * date-fns calculations run in UTC without relying on the system time zone.
 *
 * Constructor accepts no args (now), or a single timestamp / `Date` / strict ISO
 * instant string. Date-component arguments (`year, month, ...`) are not supported.
 *
 * Does not override formatter methods (`toString`, etc.).
 *
 * @example
 * new UTCDateMini(Date.UTC(1987, 1, 11)).getTime() // => Date.UTC(1987, 1, 11)
 * new UTCDateMini('2023-05-03T00:00:00.000Z').toISOString() // => '2023-05-03T00:00:00.000Z'
 *
 * @throws {ParamError} When args are invalid or the string is not a strict ISO instant
 *
 * @see https://github.com/date-fns/date-fns/tree/main/pkgs/utc
 */
export class UTCDateMini extends Date {
  public constructor(...args: UTCDateConstructorParams) {
    super();

    if (args.length === 0) {
      this.setTime(Date.now());
      return;
    }

    if (args.length === 1) {
      this.setTime(toEpoch(args[0]));
      return;
    }

    throw new ParamError('UTCDateMini does not support date component arguments');
  }

  public override getTimezoneOffset() {
    return 0;
  }
}

// Replace getter and setter functions with UTC counterparts
const re = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((method) => {
  if (re.test(method)) {
    const utcMethod = (Date.prototype as unknown as Record<string, unknown>)[method.replace(re, '$1UTC')];
    if (typeof utcMethod === 'function') {
      (UTCDateMini.prototype as unknown as Record<string, unknown>)[method] = utcMethod;
    }
  }
});
