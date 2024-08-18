import { describe, expect, test } from 'bun:test';
import { ossImageCrop } from './oss';

describe('ossImageCrop', () => {
  test('normal usage', () => {
    expect(ossImageCrop({ src: 'test.jpg', width: 100, height: 100, aspect: 1, position: 'center' })).toBe('test.jpg');
    expect(ossImageCrop({ src: 'test.jpg', width: 200, height: 100, aspect: 1, position: 'center' })).toBe(
      'test.jpg?x-oss-process=image/crop,x_50,y_0,w_100,h_100',
    );
    expect(ossImageCrop({ src: 'test.jpg', width: 200, height: 100, aspect: 5 / 4, position: 'center' })).toBe(
      'test.jpg?x-oss-process=image/crop,x_37,y_0,w_125,h_100',
    );
  });
});
