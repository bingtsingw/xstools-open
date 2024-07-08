import { describe, expect, test } from 'bun:test';
import * as _ from '.';

describe('string module', () => {
  describe('camel function', () => {
    test('returns correctly cased string', () => {
      const result = _.camel('hello world');
      expect(result).toEqual('helloWorld');
    });
    test('returns single word', () => {
      const result = _.camel('hello');
      expect(result).toEqual('hello');
    });
    test('returns empty string for empty input', () => {
      const result = _.camel(null as any);
      expect(result).toEqual('');
    });
    test('a word in camel case should remain in camel case', () => {
      const result = _.camel('helloWorld');
      expect(result).toEqual('helloWorld');
    });
  });

  describe('camelCase function', () => {
    test('returns non alphanumerics with -space and capital', () => {
      const result = _.camel('Exobase Starter_flash AND-go');
      expect(result).toEqual('exobaseStarterFlashAndGo');
    });
  });

  describe('snake function', () => {
    test('returns correctly cased string', () => {
      const result = _.snake('hello world');
      expect(result).toEqual('hello_world');
    });
    test('must handle strings that are camelCase', () => {
      const result = _.snake('helloWorld');
      expect(result).toEqual('hello_world');
    });
    test('must handle strings that are dash', () => {
      const result = _.snake('hello-world');
      expect(result).toEqual('hello_world');
    });
    test('splits numbers that are next to letters', () => {
      const result = _.snake('hello-world12_19-bye');
      expect(result).toEqual('hello_world_12_19_bye');
    });
    test('does not split numbers when flag is set to false', () => {
      const result = _.snake('hello-world12_19-bye', {
        splitOnNumber: false,
      });
      expect(result).toEqual('hello_world12_19_bye');
    });
    test('returns single word', () => {
      const result = _.snake('hello');
      expect(result).toEqual('hello');
    });
    test('returns empty string for empty input', () => {
      const result = _.snake(null as any);
      expect(result).toEqual('');
    });
  });

  describe('snakeCase function', () => {
    test('returns non alphanumerics with _', () => {
      const result = _.snake('Exobase Starter_flash AND-go');
      expect(result).toEqual('exobase_starter_flash_and_go');
    });
  });

  describe('dash function', () => {
    test('returns correctly cased string', () => {
      const result = _.dash('hello world');
      expect(result).toEqual('hello-world');
    });
    test('returns single word', () => {
      const result = _.dash('hello');
      expect(result).toEqual('hello');
    });
    test('returns empty string for empty input', () => {
      const result = _.dash(null as any);
      expect(result).toEqual('');
    });
    test('must handle strings that are camelCase', () => {
      const result = _.dash('helloWorld');
      expect(result).toEqual('hello-world');
    });
    test('must handle strings that are dash', () => {
      const result = _.dash('hello-world');
      expect(result).toEqual('hello-world');
    });
  });

  describe('dashCase function', () => {
    test('returns non alphanumerics with -', () => {
      const result = _.dash('Exobase Starter_flash AND-go');
      expect(result).toEqual('exobase-starter-flash-and-go');
    });
  });

  describe('template function', () => {
    test('replaces all occurrences', () => {
      const tmp = `
    Hello my name is {{name}}. I am a {{type}}.
    Not sure why I am {{reason}}.

    Thank You - {{name}}
  `;
      const data = {
        name: 'Ray',
        type: 'template',
        reason: 'so beautiful',
      };

      const result = _.template(tmp, data);
      const expected = `
    Hello my name is ${data.name}. I am a ${data.type}.
    Not sure why I am ${data.reason}.

    Thank You - ${data.name}
  `;

      expect(result).toEqual(expected);
    });

    test('replaces all occurrences given template', () => {
      const tmp = `Hello <name>.`;
      const data = {
        name: 'Ray',
      };

      const result = _.template(tmp, data, /<(.+?)>/g);
      expect(result).toEqual(`Hello ${data.name}.`);
    });
  });

  describe('capitalize function', () => {
    test('handles null', () => {
      const result = _.capitalize(null as any);
      expect(result).toEqual('');
    });
    test('converts hello as Hello', () => {
      const result = _.capitalize('hello');
      expect(result).toEqual('Hello');
    });
    test('converts hello Bob as Hello bob', () => {
      const result = _.capitalize('hello Bob');
      expect(result).toEqual('Hello bob');
    });
  });

  describe('pascal function', () => {
    test('returns non alphanumerics in pascal', () => {
      const result = _.pascal('Exobase Starter_flash AND-go');
      expect(result).toEqual('ExobaseStarterFlashAndGo');
    });
    test('returns single word', () => {
      const result = _.pascal('hello');
      expect(result).toEqual('Hello');
    });
    test('returns empty string for empty input', () => {
      const result = _.pascal(null as any);
      expect(result).toEqual('');
    });
  });

  describe('title function', () => {
    test('returns input formatted in title case', () => {
      expect(_.title('hello world')).toEqual('Hello World');
      expect(_.title('va_va_boom')).toEqual('Va Va Boom');
      expect(_.title('root-hook   -  ok!')).toEqual('Root Hook Ok!');
      expect(_.title('queryItems')).toEqual('Query Items');
      expect(_.title('queryAllItems-in_Database')).toEqual('Query All Items In Database');
    });
    test('returns empty string for bad input', () => {
      expect(_.title(null)).toEqual('');
      expect(_.title(undefined)).toEqual('');
    });
  });

  describe('trim function', () => {
    test('handles bad input', () => {
      expect(_.trim(null)).toEqual('');
      expect(_.trim(undefined)).toEqual('');
    });
    test('returns input string correctly trimmed', () => {
      expect(_.trim('\n\n\t\nhello\n\t  \n', '\n\t ')).toEqual('hello');
      expect(_.trim('hello', 'x')).toEqual('hello');
      expect(_.trim(' hello  ')).toEqual('hello');
      expect(_.trim(' __hello__  ', '_')).toEqual(' __hello__  ');
      expect(_.trim('__hello__', '_')).toEqual('hello');
      expect(_.trim('//repos////', '/')).toEqual('repos');
      expect(_.trim('/repos/:owner/:repo/', '/')).toEqual('repos/:owner/:repo');
    });

    test('handles when char to trim is special case in regex', () => {
      expect(_.trim('_- hello_- ', '_- ')).toEqual('hello');
    });
  });
});
