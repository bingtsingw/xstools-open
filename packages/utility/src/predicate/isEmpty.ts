/**
 * Checks if a value is empty.
 *
 * @example
 * isEmpty(null) // => true
 * isEmpty(undefined) // => true
 * isEmpty('') // => true
 * isEmpty([]) // => true
 * isEmpty({}) // => true
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
};
