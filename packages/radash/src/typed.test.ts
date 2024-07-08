import { describe, expect, test } from 'bun:test';
import {
  isArray,
  isDate,
  isEmpty,
  isFloat,
  isFunction,
  isInt,
  isNumber,
  isObject,
  isPrimitive,
  isPromise,
  isString,
  isSymbol,
} from './typed';

describe('typed module', () => {
  test('isString', () => {
    for (const ele of [
      null,
      undefined,
      false,
      true,
      0,
      42,
      3.14,
      NaN,
      [],
      [1, 2, 3],
      {},
      { hello: 'world' },
      Object({}),
      Object({ hello: 'world' }),
      new (class {})(),
      new (class {
        public hello = 'world';
      })(),
      new Date(),
      new Date('2022-09-01T02:19:55.976Z'),
      new Date('invalid value'),
      () => 'hello',
      BigInt(''),
      BigInt('1'),
      Symbol(''),
      Symbol('key'),
      new Map(),
      new Map().set('a', 1),
    ]) {
      expect(isString(ele)).toBeFalse();
    }

    for (const ele of [
      '',
      String(''),
      'acb',
      String('abc'),
    ]) {
      expect(isString(ele)).toBeTrue();
    }
  });

  test('isInt', () => {
    for (const ele of [
      null,
      undefined,
      false,
      true,
      3.14,
      NaN,
      '',
      String(''),
      'acb',
      String('abc'),
      [],
      [1, 2, 3],
      {},
      { hello: 'world' },
      Object({}),
      Object({ hello: 'world' }),
      new (class {})(),
      new (class {
        public hello = 'world';
      })(),
      new Date(),
      new Date('2022-09-01T02:19:55.976Z'),
      new Date('invalid value'),
      () => 'hello',
      BigInt(''),
      BigInt('1'),
      Symbol(''),
      Symbol('key'),
      new Map(),
      new Map().set('a', 1),
    ]) {
      expect(isInt(ele)).toBeFalse();
    }

    for (const ele of [
      0,
      42,
    ]) {
      expect(isInt(ele)).toBeTrue();
    }
  });

  test('isFloat', () => {
    for (const ele of [
      null,
      undefined,
      false,
      true,
      0,
      42,
      NaN,
      '',
      String(''),
      'acb',
      String('abc'),
      [],
      [1, 2, 3],
      {},
      { hello: 'world' },
      Object({}),
      Object({ hello: 'world' }),
      new (class {})(),
      new (class {
        public hello = 'world';
      })(),
      new Date(),
      new Date('2022-09-01T02:19:55.976Z'),
      new Date('invalid value'),
      () => 'hello',
      BigInt(''),
      BigInt('1'),
      Symbol(''),
      Symbol('key'),
      new Map(),
      new Map().set('a', 1),
    ]) {
      expect(isFloat(ele)).toBeFalse();
    }

    for (const ele of [
      3.14,
    ]) {
      expect(isFloat(ele)).toBeTrue();
    }
  });

  test('isNumber', () => {
    for (const ele of [
      null,
      undefined,
      false,
      true,
      NaN,
      '',
      String(''),
      'acb',
      String('abc'),
      [],
      [1, 2, 3],
      {},
      { hello: 'world' },
      Object({}),
      Object({ hello: 'world' }),
      new (class {})(),
      new (class {
        public hello = 'world';
      })(),
      new Date(),
      new Date('2022-09-01T02:19:55.976Z'),
      new Date('invalid value'),
      () => 'hello',
      BigInt(''),
      BigInt('1'),
      Symbol(''),
      Symbol('key'),
      new Map(),
      new Map().set('a', 1),
    ]) {
      expect(isNumber(ele)).toBeFalse();
    }

    for (const ele of [
      0,
      42,
      3.14,
    ]) {
      expect(isNumber(ele)).toBeTrue();
    }
  });

  test('isPrimitive', () => {
    for (const ele of [
      null,
      undefined,
      false,
      true,
      0,
      42,
      3.14,
      NaN,
      '',
      String(''),
      'acb',
      String('abc'),
      BigInt(''),
      BigInt('1'),
      Symbol(''),
      Symbol('key'),
    ]) {
      expect(isPrimitive(ele)).toBeTrue();
    }

    for (const ele of [
      [],
      [1, 2, 3],
      {},
      { hello: 'world' },
      Object({}),
      Object({ hello: 'world' }),
      new (class {})(),
      new (class {
        public hello = 'world';
      })(),
      new Date(),
      new Date('2022-09-01T02:19:55.976Z'),
      new Date('invalid value'),
      () => 'hello',
      Number,
      String,
      () => 0,
      [1, 2, 3],
      new Map(),
      new Map().set('a', 1),
    ]) {
      expect(isPrimitive(ele)).toBeFalse();
    }
  });

  test('isArray', () => {
    for (const ele of [
      null,
      undefined,
      false,
      true,
      0,
      42,
      3.14,
      NaN,
      '',
      String(''),
      'acb',
      String('abc'),
      {},
      { hello: 'world' },
      Object({}),
      Object({ hello: 'world' }),
      new (class {})(),
      new (class {
        public hello = 'world';
      })(),
      new Date(),
      new Date('2022-09-01T02:19:55.976Z'),
      new Date('invalid value'),
      () => 'hello',
      BigInt(''),
      BigInt('1'),
      Symbol(''),
      Symbol('key'),
      new Map(),
      new Map().set('a', 1),
    ]) {
      expect(isArray(ele)).toBeFalse();
    }

    for (const ele of [
      [],
      [1, 2, 3],
    ]) {
      expect(isArray(ele)).toBeTrue();
    }
  });

  test('isObject', () => {
    for (const ele of [
      null,
      undefined,
      false,
      true,
      0,
      42,
      3.14,
      NaN,
      '',
      String(''),
      'acb',
      String('abc'),
      [],
      [1, 2, 3],
      new (class {})(),
      new (class {
        public hello = 'world';
      })(),
      new Date(),
      new Date('2022-09-01T02:19:55.976Z'),
      new Date('invalid value'),
      () => 'hello',
      BigInt(''),
      BigInt('1'),
      Symbol(''),
      Symbol('key'),
      new Map(),
      new Map().set('a', 1),
    ]) {
      expect(isObject(ele)).toBeFalse();
    }

    for (const ele of [
      {},
      { hello: 'world' },
      Object({}),
      Object({ hello: 'world' }),
    ]) {
      expect(isObject(ele)).toBeTrue();
    }
  });

  test('isSymbol', () => {
    for (const ele of [
      null,
      undefined,
      false,
      true,
      0,
      42,
      3.14,
      NaN,
      '',
      String(''),
      'acb',
      String('abc'),
      [],
      [1, 2, 3],
      {},
      { hello: 'world' },
      Object({}),
      Object({ hello: 'world' }),
      new (class {})(),
      new (class {
        public hello = 'world';
      })(),
      new Date(),
      new Date('2022-09-01T02:19:55.976Z'),
      new Date('invalid value'),
      () => 'hello',
      BigInt(''),
      BigInt('1'),
      new Map(),
      new Map().set('a', 1),
    ]) {
      expect(isSymbol(ele)).toBeFalse();
    }

    for (const ele of [
      Symbol(''),
      Symbol('key'),
    ]) {
      expect(isSymbol(ele)).toBeTrue();
    }
  });

  test('isDate', () => {
    for (const ele of [
      null,
      undefined,
      false,
      true,
      0,
      42,
      3.14,
      NaN,
      '',
      String(''),
      'acb',
      String('abc'),
      [],
      [1, 2, 3],
      {},
      { hello: 'world' },
      Object({}),
      Object({ hello: 'world' }),
      new (class {})(),
      new (class {
        public hello = 'world';
      })(),
      () => 'hello',
      BigInt(''),
      BigInt('1'),
      Symbol(''),
      Symbol('key'),
      new Map(),
      new Map().set('a', 1),
    ]) {
      expect(isDate(ele)).toBeFalse();
    }

    for (const ele of [
      new Date(),
      new Date('2022-09-01T02:19:55.976Z'),
      new Date('invalid value'),
    ]) {
      expect(isDate(ele)).toBeTrue();
    }
  });

  test('isFunction', () => {
    for (const ele of [
      null,
      undefined,
      false,
      true,
      0,
      42,
      3.14,
      NaN,
      '',
      String(''),
      'acb',
      String('abc'),
      [],
      [1, 2, 3],
      {},
      { hello: 'world' },
      Object({}),
      Object({ hello: 'world' }),
      new (class {})(),
      new (class {
        public hello = 'world';
      })(),
      new Date(),
      new Date('2022-09-01T02:19:55.976Z'),
      new Date('invalid value'),
      BigInt(''),
      BigInt('1'),
      Symbol(''),
      Symbol('key'),
      new Map(),
      new Map().set('a', 1),
    ]) {
      expect(isFunction(ele)).toBeFalse();
    }

    function sayHello() {
      return 'hello';
    }
    for (const ele of [
      () => 'hello',
      sayHello,
    ]) {
      expect(isFunction(ele)).toBeTrue();
    }
  });

  test('isPromise', () => {
    for (const ele of [
      null,
      undefined,
      false,
      true,
      0,
      42,
      3.14,
      NaN,
      '',
      String(''),
      'acb',
      String('abc'),
      [],
      [1, 2, 3],
      {},
      { hello: 'world' },
      { then: 2 },
      Object({}),
      Object({ hello: 'world' }),
      new (class {})(),
      new (class {
        public hello = 'world';
      })(),
      new Date(),
      new Date('2022-09-01T02:19:55.976Z'),
      new Date('invalid value'),
      () => 'hello',
      BigInt(''),
      BigInt('1'),
      Symbol(''),
      Symbol('key'),
      new Map(),
      new Map().set('a', 1),
    ]) {
      expect(isPromise(ele)).toBeFalse();
    }

    for (const ele of [
      new Promise((res) => {
        res(0);
      }),
      new Promise((res) => {
        res('');
      }),
      (async () => {})(),
    ]) {
      expect(isPromise(ele)).toBeTrue();
    }
  });

  test('isEmpty', () => {
    for (const ele of [
      42,
      3.14,
      'acb',
      String('abc'),
      [1, 2, 3],
      { hello: 'world' },
      Object({ hello: 'world' }),
      new (class {
        public hello = 'world';
      })(),
      new Date(),
      new Date('2022-09-01T02:19:55.976Z'),
      () => ({}),
      () => 'hello',
      Symbol(''),
      Symbol('key'),
      new Map().set('a', 1),
    ]) {
      expect(isEmpty(ele)).toBeFalse();
    }

    for (const ele of [
      null,
      undefined,
      false,
      true,
      0,
      NaN,
      '',
      String(''),
      [],
      {},
      Object({}),
      new (class {})(),
      new Date('invalid value'),
      BigInt(''),
      BigInt('1'),
      new Map(),
    ]) {
      expect(isEmpty(ele)).toBeTrue();
    }
  });
});
