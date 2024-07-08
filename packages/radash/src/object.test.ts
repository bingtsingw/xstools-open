import { describe, expect, test } from 'bun:test';
import * as _ from '.';

const NULL = null as unknown as {};

describe('object module', () => {
  describe('shake function', () => {
    test('removes all undefined values', () => {
      const result = _.shake({
        x: 2,
        y: null,
        z: undefined,
        o: false,
        r: 'x',
      });
      expect(result).toEqual({
        x: 2,
        y: null,
        o: false,
        r: 'x',
      });
    });
    test('removes values based on filter function input', () => {
      const result = _.shake(
        {
          x: 2,
          y: null,
          z: undefined,
          o: false,
          r: 'x',
        },
        (val) => val !== 'x',
      );
      expect(result).toEqual({ r: 'x' });
    });
    test('handles undefined input', () => {
      const result = _.shake(undefined);
      expect(result).toEqual({});
    });
  });

  describe('mapKeys function', () => {
    test('runs all keys against mapper function', () => {
      const prefixWith = (prefix: string) => (str: string) => `${prefix}${str}`;
      const result = _.mapKeys(
        {
          x: 22,
          y: 8,
        },
        prefixWith('x'),
      );
      expect(result).toEqual({
        xx: 22,
        xy: 8,
      });
    });
  });

  describe('mapValues function', () => {
    test('runs all values against mapper function', () => {
      const prefixWith = (prefix: string) => (str: string) => `${prefix}${str}`;
      const result = _.mapValues(
        {
          x: 'hi',
          y: 'bye',
        },
        prefixWith('x'),
      );
      expect(result).toEqual({
        x: 'xhi',
        y: 'xbye',
      });
    });
  });

  describe('lowerize function', () => {
    test('changes all keys to lower case', () => {
      const result = _.lowerize({
        'X-Api-Key': 'value',
        Bearer: 'value',
      });
      expect(result).toEqual({
        'x-api-key': 'value',
        bearer: 'value',
      });
    });
  });

  describe('upperize function', () => {
    test('changes all keys to upper case', () => {
      const result = _.upperize({
        'x-api-key': 'value',
        bearer: 'value',
      });
      expect(result).toEqual({
        'X-API-KEY': 'value',
        BEARER: 'value',
      });
    });
  });

  describe('clone function', () => {
    test('copies the primitives', () => {
      const arr = [
        1.1,
        'How you doin?',
        false,
        Symbol('key'),
        BigInt('1'),
        undefined,
        null,
      ];
      for (const elm of arr) {
        const newElm = _.clone(elm);
        expect<typeof elm>(elm).toEqual(newElm);
      }
    });

    test('copies arrays', () => {
      const arr = [{ a: 0 }, 1, 2, 3];
      const result = _.clone(arr);

      expect(arr).not.toBe(result);
      expect(arr).toEqual(result);
    });

    test('copies functions', () => {
      const fa = () => 0;
      const fb = _.clone(fa);

      expect(fa).not.toEqual(fb);
      expect(fa()).toEqual(fb());
    });
    test('copies objects (class instances) without losing the class type', () => {
      class Data {
        public val = 0;
      }

      const obj = new Data();
      obj.val = 1;
      const result = _.clone(obj);

      expect(obj).not.toBe(result);
      expect(obj).toEqual(result);
      expect(obj.constructor.name).toEqual(result.constructor.name);
    });
    test('copies all attributes from object', () => {
      const obj = {
        x: 22,
        add: (a: number, b: number) => a + b,
        child: {
          key: 'yolo',
        },
      };
      const result = _.clone(obj);
      expect(result.x).toEqual(obj.x);
      expect(result.add(2, 2)).toEqual(obj.add(2, 2));
      expect(result.child.key).toEqual(obj.child.key);
    });
    test('copies all attributes from class instance', () => {
      class Data {
        public x = 22;
        public child = { key: 'yolo' };
        public add(a: number, b: number) {
          return a + b;
        }
      }
      const result = _.clone(new Data());
      expect(result.x).toEqual(22);
      // @warning will not copy functions from class instance
      // expect(result.add(2, 2), 4)
      expect(result.child.key).toEqual('yolo');
    });
  });

  describe('listify function', () => {
    test('handles null input', () => {
      const result = _.listify(null as any as Record<string, string>, () => 1);
      expect(result).toEqual([]);
    });
    test('handles empty object', () => {
      const result = _.listify({} as Record<string, string>, () => 1);
      expect(result).toEqual([]);
    });
    test('calls toItem to convert to list', () => {
      type Index = 'one' | 'two';
      const obj: Record<Index, any> = {
        one: { name: 'ray' },
        two: { name: 'ash' },
      };
      const result = _.listify(obj, (key, value) => ({
        index: key,
        name: value.name,
      }));
      expect(result).toEqual([
        { index: 'one', name: 'ray' },
        { index: 'two', name: 'ash' },
      ]);
    });
  });

  describe('pick function', () => {
    test('handles null input', () => {
      const result = _.pick(null as unknown as Record<string, unknown>, []);
      expect(result).toEqual({});
    });
    test('handles empty keys', () => {
      const result = _.pick({ a: 2 }, []);
      expect(result).toEqual({});
    });
    test('handle key not in object', () => {
      const result = _.pick({ a: 2, b: 3 }, ['c'] as any);
      expect(result).toEqual({} as any);
    });
    test('handle one key not in object', () => {
      const result = _.pick({ a: 2, b: 3 }, ['a', 'c'] as any);
      expect(result).toEqual({ a: 2 } as any);
    });
    test('does not ignore undefined values', () => {
      const result = _.pick({ a: 2, b: undefined }, ['b']);
      expect(result).toEqual({ b: undefined });
    });
    test('returns picked properties only', () => {
      const result = _.pick({ a: 2, b: 4 }, ['a']);
      expect(result).toEqual({
        a: 2,
      });
    });
    test('type: accepts an interface', () => {
      interface SomeDeclaredType {
        a: string;
        b: Error;
        c: number[];
      }
      const x: SomeDeclaredType = {
        a: 'alpha',
        b: new Error('beta'),
        c: [3],
      };
      const result = _.pick(x, ['a']);
      expect(result).toEqual({
        a: 'alpha',
      });
    });
    test('works with proxified objects', () => {
      const target = {
        a: 'hello',
        b: 'everyone',
      };
      const handler1 = {
        get() {
          return 'world';
        },
      };
      const proxified = new Proxy(target, handler1);
      const result = _.pick(proxified, ['a']);
      expect(result).toEqual({
        a: 'world',
      });
    });
    test('works with objects created without the prototype chain of Object e.g. by `Object.create(null)`', () => {
      const obj = Object.create(null);
      obj.a = 2;
      obj.b = 4;
      const result = _.pick(obj, ['a']);
      expect(result).toEqual({
        a: 2,
      });
    });
    test('works with objects that have `hasOwnProperty` overwritten', () => {
      const obj = { a: 2, b: 4 };
      // @ts-ignore
      obj.hasOwnProperty = 'OVERWRITTEN';
      const result = _.pick(obj, ['a']);
      expect(result).toEqual({
        a: 2,
      });
    });
  });

  describe('omit function', () => {
    const person = {
      name: 'jay',
      age: 20,
      active: true,
    };
    test('handles null input', () => {
      const result = _.omit(null, []);
      expect(result).toEqual({});
    });
    test('handles empty keys', () => {
      const result = _.omit(person, []);
      expect(result).toEqual(person);
    });
    test('handles null keys', () => {
      const result = _.omit(person, null as unknown as []);
      expect(result).toEqual(person);
    });
    test('returns object without omitted properties', () => {
      const result = _.omit(person, ['name']);
      expect(result).toEqual({
        age: 20,
        active: true,
      });
    });
  });

  describe('get function', () => {
    interface Person {
      name: string;
      age: number;
      friends?: Person[];
    }
    const jay: Person = {
      name: 'jay',
      age: 17,
      friends: [
        {
          name: 'carl',
          age: 17,
          friends: [
            {
              name: 'sara',
              age: 17,
            },
          ],
        },
      ],
    };
    test('handles null and undefined input', () => {
      expect(_.get(null, 'name')).toBeUndefined();
      expect(_.get(undefined, 'name')).toBeUndefined();
    });
    test('respects undefined as default value', () => {
      expect(_.get({}, 'a.b.c', undefined)).toEqual(undefined);
    });
    test('returns specified value or default using path', () => {
      expect(_.get({ age: undefined }, 'age', 22)).toEqual(22);
      expect(_.get<number>(jay, 'friends[0].age')).toEqual(17);
      expect(_.get<number>(jay, 'friends["0"].age')).toEqual(17);
      expect(_.get<number>(jay, 'friends.0.age')).toEqual(17);
      expect(_.get(jay, 'friends.1.age')).toBeUndefined();
      expect(_.get<string>(jay, 'friends.0.friends[0].name')).toEqual('sara');
      expect(_.get<string>(jay, 'name')).toEqual('jay');
      expect(_.get<string>(jay, '[name]')).toEqual('jay');
      expect(_.get<string>(jay, '["name"]')).toEqual('jay');
      expect(_.get<string>(jay, 'friends[0][name]')).toEqual('carl');
      expect(_.get(jay, 'friends[0].friends[0].friends[0].age', 22)).toEqual(22);
    });
  });

  describe('mapEntries function', () => {
    const peopleByRole = {
      admin: 'jay',
      user: 'fey',
      guest: 'bray',
    };
    test('handles null input', () => {
      const result = _.mapEntries(
        NULL,
        null as unknown as (key: never, value: never) => [string | number | symbol, unknown],
      );
      expect(result).toEqual({});
    });
    test('correctly maps keys and values', () => {
      const result = _.mapEntries(peopleByRole, (key, value) => [
        value,
        key.toUpperCase(),
      ]);
      expect(result.jay).toEqual('ADMIN');
      expect(result.fey).toEqual('USER');
      expect(result.bray).toEqual('GUEST');
    });
  });

  describe('invert function', () => {
    const peopleByRole = {
      admin: 'jay',
      user: 'fey',
      guest: 'bray',
    };
    test('handles null input', () => {
      const result = _.invert(NULL);
      expect(result).toEqual({});
    });
    test('correctly maps keys and values', () => {
      const result = _.invert(peopleByRole);
      expect(result.jay).toEqual('admin');
      expect(result.fey).toEqual('user');
      expect(result.bray).toEqual('guest');
    });
  });

  describe('assign function', () => {
    const initial = {
      name: 'jay',
      cards: ['ac'],
      location: {
        street: '23 main',
        state: {
          abbrv: 'FL',
          name: 'Florida',
        },
      },
    };
    const override = {
      name: 'charles',
      cards: ['4c'],
      location: {
        street: '8114 capo',
        state: {
          abbrv: 'TX',
          name: 'Texas',
        },
      },
    };
    test('handles both null input', () => {
      const result = _.assign(NULL, NULL);
      expect(result).toEqual({});
    });
    test('handles null first input', () => {
      const result = _.assign({ a: 'y' }, NULL);
      expect(result).toEqual({ a: 'y' });
    });
    test('handles null last input', () => {
      const result = _.assign(NULL, { a: 'y' });
      expect(result).toEqual({ a: 'y' });
    });
    test('correctly assign a with values from b', () => {
      const result = _.assign(initial, override);
      expect(result).toEqual(override);
    });
    test('handles initial have unique value', () => {
      const result = _.assign({ a: 'x' }, {});
      expect(result).toEqual({ a: 'x' });
    });
    test('handles override have unique value', () => {
      const result = _.assign({}, { b: 'y' });
      expect(result).toEqual({ b: 'y' });
    });
  });

  describe('keys function', () => {
    test('handles bad input', () => {
      expect(_.keys({})).toEqual([]);
      expect(_.keys(null as any)).toEqual([]);
      expect(_.keys(undefined as any)).toEqual([]);
    });
    test('returns correct list of keys', () => {
      const ra = {
        name: 'ra',
        power: 100,
        friend: {
          name: 'loki',
          power: 80,
        },
        enemies: [
          {
            name: 'hathor',
            power: 12,
          },
        ],
      };
      expect(_.keys(ra)).toEqual([
        'name',
        'power',
        'friend.name',
        'friend.power',
        'enemies.0.name',
        'enemies.0.power',
      ]);
    });
  });

  describe('set function', () => {
    test('handles bad input', () => {
      expect(_.set({}, '', {})).toEqual({});
      expect(_.set({}, null as any, {})).toEqual({});
      expect(_.set({}, '', null as any)).toEqual({});
      expect(_.set(null as any, '', {})).toEqual({});
      expect(_.set(null as any, null as any, null as any)).toEqual({});
      expect(_.set({ foo: true }, 'foo', false)).toEqual({ foo: false });
      expect(_.set({}, 'foo', 0)).toEqual({ foo: 0 });
    });
    test('sets deep values correctly', () => {
      expect(_.set({}, 'cards.value', 2)).toEqual({
        cards: { value: 2 },
      });
      expect(_.set({}, 'cards.0.value', 2)).toEqual({
        cards: [{ value: 2 }],
      });
      expect(_.set({}, 'cards.0.0.value', 2)).toEqual({
        cards: [[{ value: 2 }]],
      });
      expect(_.set({}, 'cards.[0].[0].value', 2)).toEqual({
        cards: [[{ value: 2 }]],
      });
      expect(_.set({}, 'cards.[1].[1].value', 2)).toEqual({
        cards: [undefined, [undefined, { value: 2 }]],
      });
    });
  });

  describe('crush function', () => {
    test('handles bad input', () => {
      expect(_.crush({})).toEqual({});
      expect(_.crush(null as any)).toEqual({});
      expect(_.crush(undefined as any)).toEqual({});
    });
    test('returns correctly crushed object', () => {
      const now = new Date();
      const ra = {
        name: 'ra',
        power: 100,
        friend: {
          name: 'loki',
          power: 80,
        },
        enemies: [
          {
            name: 'hathor',
            power: 12,
          },
        ],
        timestamp: now,
      };
      expect(_.crush(ra)).toEqual({
        name: 'ra',
        power: 100,
        'friend.name': 'loki',
        'friend.power': 80,
        'enemies.0.name': 'hathor',
        'enemies.0.power': 12,
        timestamp: now,
      });
    });
  });

  describe('construct function', () => {
    test('handles bad input', () => {
      expect(_.construct({})).toEqual({});
      expect(_.construct(null as any)).toEqual({});
      expect(_.construct(undefined as any)).toEqual({});
    });
    test('returns correctly constructed object', () => {
      const now = new Date();
      const ra = {
        name: 'ra',
        power: 100,
        friend: {
          name: 'loki',
          power: 80,
        },
        enemies: [
          {
            name: 'hathor',
            power: 12,
          },
          {
            name: 'vishnu',
            power: 58,
          },
        ],
        timestamp: now,
      };
      expect(
        _.construct({
          name: 'ra',
          power: 100,
          'friend.name': 'loki',
          'friend.power': 80,
          'enemies.0.name': 'hathor',
          'enemies.0.power': 12,
          'enemies.1.name': 'vishnu',
          'enemies.1.power': 58,
          timestamp: now,
        }),
      ).toEqual(ra);
    });
  });
});
