/**
 * Converts an array to an `arguments` object.
 *
 * @example
 * toArgs([1, 2, 3]); // => { '0': 1, '1': 2, '2': 3 } as IArguments
 */
export const toArgs = (arr: unknown[]): IArguments => {
  return (function (..._: unknown[]) {
    return arguments;
  })(...arr);
};
