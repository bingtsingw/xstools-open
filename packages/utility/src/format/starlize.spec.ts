import { describe, expect, test } from 'bun:test';
import { starlizeCard, starlizeName } from './starlize';

describe('starlize', () => {
  test('starlizeName', () => {
    expect(starlizeName('')).toEqual('');
    expect(starlizeName('张')).toEndWith('张');
    expect(starlizeName('张三')).toEndWith('*三');
    expect(starlizeName('张三李')).toEndWith('张*李');
    expect(starlizeName('张三李四')).toEndWith('张**四');
  });

  test('starlizeCard', () => {
    expect(starlizeCard('', 0, 0)).toEqual('');
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
