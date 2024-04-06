import { InternalErrorException } from '../exception/500';

// https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not
const isJson = (value: any): boolean => {
  let _value = typeof value !== 'string' ? JSON.stringify(value) : value;

  try {
    const _parse = JSON.parse(_value);
    return typeof _parse === 'object' && _parse !== null;
  } catch (_e) {
    return false;
  }
};

export const stringify = (value: any): string => {
  if (!isJson(value)) {
    throw new InternalErrorException('Not Valid JSON');
  }

  if (typeof value === 'string') {
    return value;
  } else {
    return JSON.stringify(value);
  }
};
