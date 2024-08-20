import { describe, expect, test } from 'bun:test';
import { formatBytes } from './bytes';

describe('formatBytes', () => {
  test('normal usage', () => {
    expect(formatBytes(0)).toEqual('0 B');
    expect(formatBytes(1)).toEqual('1 B');
    expect(formatBytes(1000)).toEqual('1000 B');
    expect(formatBytes(1024)).toEqual('1 KB');
    expect(formatBytes(2048)).toEqual('2 KB');
    expect(formatBytes(2560)).toEqual('2.5 KB');
    expect(formatBytes(1111)).toEqual('1.08 KB');

    expect(formatBytes(2560000)).toEqual('2.44 MB');
    expect(formatBytes(Math.pow(1024, 3))).toEqual('1 GB');
    expect(formatBytes(Math.pow(1024, 4))).toEqual('1 TB');
    expect(formatBytes(Math.pow(1024, 5))).toEqual('1 PB');
    expect(formatBytes(Math.pow(1024, 6))).toEqual('1 EB');
    expect(formatBytes(Math.pow(1024, 7))).toEqual('1 ZB');
    expect(formatBytes(Math.pow(1024, 8))).toEqual('1 YB');
    expect(formatBytes(Math.pow(1024, 9))).toEqual('1024 YB');
    expect(formatBytes(Math.pow(1024, 10))).toEqual('1048576 YB');
  });

  // test('with decimals', () => {
  //   expect(formatBytes(1024, 0)).toEqual('1 KB');

  //   // TODO: error
  //   expect(formatBytes(1024, 1)).toEqual('1 KB');
  //   expect(formatBytes(1024, 2)).toEqual('1.00 KB');
  // })
});
