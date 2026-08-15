import { describe, expect, test } from 'bun:test';
import { merge } from './merge';
import { mergeWith } from './mergeWith';

const equal = (actual: unknown, expected: unknown) => {
  expect(actual).toEqual(expected);
};

describe('merge', () => {
  test('merges own enumerable properties', () => {
    const target = { a: 1, b: 2 };
    const result = merge(target, { b: 3, c: 4 });

    equal(result, { a: 1, b: 3, c: 4 });
    expect(result === target).toBe(true);
  });

  test('deeply merges nested plain objects', () => {
    const target = { a: { x: 1, y: 2 }, b: 2 };
    equal(merge(target, { a: { y: 3, z: 4 }, c: 5 }), { a: { x: 1, y: 3, z: 4 }, b: 2, c: 5 });
    equal(target.a, { x: 1, y: 3, z: 4 });
  });

  test('merges arrays by index, not concat', () => {
    equal(merge({ a: [1, 2] }, { a: [3] }), { a: [3, 2] });
    equal(merge({ a: [1, 2] }, { a: [3, 4] }), { a: [3, 4] });
    equal(merge({ a: [{ b: 2 }, { d: 4 }] }, { a: [{ c: 3 }, { e: 5 }] }), {
      a: [
        { b: 2, c: 3 },
        { d: 4, e: 5 },
      ],
    });
  });

  test('sparse source array does not fill holes', () => {
    const source: unknown[] = [];
    source[1] = 9;
    equal(merge({ a: [1, 2, 3] }, { a: source }), { a: [1, 9, 3] });
  });

  test('undefined in source does not overwrite a defined target value', () => {
    equal(merge({ a: 1, b: 2 }, { b: undefined, c: 3 }), { a: 1, b: 2, c: 3 });
  });

  test('assigns undefined when the target key is missing or already undefined', () => {
    equal(merge({}, { a: undefined }), { a: undefined });
    equal(merge({ a: undefined }, { a: undefined }), { a: undefined });
  });

  test('null overwrites', () => {
    equal(merge({ a: 1 }, { a: null }), { a: null });
    equal(merge({ a: { x: 1 } }, { a: null }), { a: null });
    equal(merge({ a: null }, { a: [1, 2, 3] }), { a: [1, 2, 3] });
  });

  test('object vs array: source type wins and is cloned', () => {
    const targetObject = { x: 1 };
    const resultFromArray = merge({ a: targetObject }, { a: [1, 2] });
    equal(resultFromArray, { a: [1, 2] });
    expect(Array.isArray(resultFromArray.a)).toBe(true);
    equal(targetObject, { x: 1 });

    const targetArray = [1, 2];
    const resultFromObject = merge({ a: targetArray }, { a: { x: 1 } });
    equal(resultFromObject, { a: { x: 1 } });
    equal(targetArray, [1, 2]);
  });

  test('clones nested plain objects and arrays from source', () => {
    const nested = { x: 1 };
    const arr = [1, 2];
    const source = { a: nested, b: arr };
    const result = merge({}, source);

    equal(result.a, { x: 1 });
    expect(result.a).not.toBe(nested);
    equal(result.b, [1, 2]);
    expect(result.b).not.toBe(arr);

    nested.x = 9;
    arr[0] = 9;
    expect(result.a.x).toBe(1);
    expect(result.b[0]).toBe(1);
  });

  test('mutates existing nested target objects and arrays in place', () => {
    const nested = { x: 1 };
    const arr = [1, 2];
    const target = { a: nested, b: arr };

    merge(target, { a: { y: 2 }, b: [3] });

    expect(target.a).toBe(nested);
    equal(nested, { x: 1, y: 2 });
    expect(target.b).toBe(arr);
    equal(arr, [3, 2]);
  });

  test('does not mutate source nested structures', () => {
    const source = { a: { x: 1 }, b: [1, { y: 2 }] };
    merge({ a: { z: 3 } }, source);

    equal(source, { a: { x: 1 }, b: [1, { y: 2 }] });
  });

  test('Date and class instances are assigned by reference', () => {
    const date = new Date('2020-01-01');
    const result = merge({}, { a: date });
    expect(result.a).toBe(date);

    class Foo {
      public x = 1;
    }
    const instance = new Foo();
    const merged = merge({ a: { y: 2 } }, { a: instance });
    expect(merged.a === instance).toBe(true);
  });

  test('Object.create(null) is treated as a plain object', () => {
    const source = Object.create(null);
    source.a = 1;
    source.b = { c: 2 };

    const result = merge({ b: { d: 3 } }, source);
    equal(result, { a: 1, b: { d: 3, c: 2 } });
    expect(result.b).not.toBe(source.b);
  });

  test('ignores inherited and symbol keys', () => {
    const proto = { inherited: 1 };
    const source = Object.create(proto);
    source.own = 2;
    const sym = Symbol('s');
    const withSymbol = { a: 1, [sym]: 2, b: 3 };

    equal(merge({}, source), { own: 2 });
    equal(merge({ a: 0 }, withSymbol), { a: 1, b: 3 });
  });

  test('skips unsafe write keys', () => {
    const viaJson = JSON.parse('{"__proto__":{"polluted":true},"a":2}');
    const result = merge({ a: 1 }, viaJson);
    expect(result.a).toBe(2);
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();

    equal(merge({ a: 1 }, { constructor: { polluted: true }, a: 2 } as { a: number }), { a: 2 });
    equal(merge({ a: 1 }, { prototype: { x: 1 }, a: 2 }), { a: 2 });
  });

  test('handles circular references in source', () => {
    const node: { a: number; self?: unknown } = { a: 1 };
    node.self = node;

    const result = merge({ b: 2 }, node);
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(result.self).toBe(result);
  });

  test('clones circular nested graphs without overflowing', () => {
    interface Node {
      rules: object;
      configs: { recommended: { plugins: { self: Node } } };
    }
    const node = { rules: {} } as Node;
    node.configs = { recommended: { plugins: { self: node } } };

    const result = merge({}, { plugins: { self: node } });
    const cloned = result.plugins.self;

    expect(cloned).not.toBe(node);
    equal(cloned.rules, {});
    expect(cloned.rules).not.toBe(node.rules);
    expect(cloned.configs.recommended.plugins.self).toBe(cloned);
  });

  test('diamond references share the cloned object', () => {
    const shared = { n: 1 };
    const result = merge({}, { a: shared, b: shared });

    equal(result.a, { n: 1 });
    expect(result.a).not.toBe(shared);
    expect(result.a).toBe(result.b);
  });

  test('nullish or non-object target or source is a no-op', () => {
    expect(merge(null as any, { a: 1 })).toBeNull();
    expect(merge(undefined as any, { a: 1 })).toBeUndefined();
    expect(merge(1 as any, { a: 1 })).toBe(1);
    equal(merge({ a: 1 }, null as any), { a: 1 });
    equal(merge({ a: 1 }, undefined as any), { a: 1 });
    equal(merge({ a: 1 }, 2 as any), { a: 1 });
  });

  test('is equivalent to mergeWith when the customizer always returns undefined', () => {
    const pairs = [
      [
        { a: 1, b: { x: 1 } },
        { b: { y: 2 }, c: undefined },
      ],
      [{ a: [1, 2] }, { a: [3] }],
      [{ a: { x: 1 } }, { a: [1, 2] }],
      [{ a: [1, 2] }, { a: { x: 1 } }],
      [{ a: null }, { a: { x: 1 } }],
    ] as const;

    for (const [targetSeed, source] of pairs) {
      const viaMerge = merge(structuredClone(targetSeed), structuredClone(source));
      const viaMergeWith = mergeWith(structuredClone(targetSeed), structuredClone(source), () => undefined);
      equal(viaMerge, viaMergeWith);
    }
  });
});
