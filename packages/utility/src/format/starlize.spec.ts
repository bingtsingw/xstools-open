import { describe, expect, test } from 'bun:test';
import { starlizeCard, starlizeName } from './starlize';

describe('starlize', () => {
  test('starlizeName', () => {
    expect(starlizeName('')).toEqual('');
    expect(starlizeName('张')).toEqual('张');
    expect(starlizeName('张三')).toEqual('*三');
    expect(starlizeName('张三李')).toEqual('张*李');
    expect(starlizeName('张三李四')).toEqual('张**四');
  });

  test('starlizeCard', () => {
    expect(starlizeCard('', 0, 0)).toEqual('');
    expect(starlizeCard('0000', 1, 1)).toEqual('0**0');
    expect(starlizeCard('0000', 2, 1)).toEqual('00*0');
    expect(starlizeCard('0000000000000000', 0, 0)).toEqual('****************');
    expect(starlizeCard('0', 4, 3)).toEqual('*');
    expect(starlizeCard('00', 4, 3)).toEqual('**');
    expect(starlizeCard('000', 4, 3)).toEqual('***');
    expect(starlizeCard('0000', 4, 3)).toEqual('*000');
    expect(starlizeCard('0000000', 4, 3)).toEqual('****000');
    expect(starlizeCard('00000000', 4, 3)).toEqual('0000*000');
    expect(starlizeCard('0000000000000000', 4, 4)).toEqual('0000********0000');
  });
});
