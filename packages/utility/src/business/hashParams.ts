import { createHash } from 'crypto';

/**
 * Hash id and params combination, ignore order of params keys.
 *
 * @example
 * hashParams({ id: '1', params: { a: 1, b: 2 } }) // '1:{"a":1,"b":2}'
 * hashParams({ id: '1', params: { b: 2, a: 1 } }) // '1:{"a":1,"b":2}'
 */
export const hashParams = ({ id, params }: { id: string; params: object }): string => {
  const sort = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key as keyof typeof params] = params[key as keyof typeof params];
      return result;
    }, {});

  const str = `${id}:${JSON.stringify(sort)}`;

  return createHash('sha256').update(str).digest('hex');
};
