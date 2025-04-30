interface IOssImageCrop {
  src: string;
  width: number | string;
  height: number | string;
  aspect: number;
  position: 'center' | 'top';
}

/**
 * 生成阿里云oss图片裁剪地址
 *
 * @example
 * ossImageCrop({ src: 'test.jpg', width: 100, height: 100, aspect: 1, position: 'center' }) // => test.jpg
 * ossImageCrop({ src: 'test.jpg', width: 200, height: 100, aspect: 1, position: 'center' }) // => test.jpg?x-oss-process=image/crop,x_50,y_0,w_100,h_100
 */
export const ossImageCrop = ({ src, width, height, aspect, position }: IOssImageCrop): string => {
  let cWidth: number;
  let cHeight: number;
  const oWidth = parseInt(width.toString(), 10);
  const oHeight = parseInt(height.toString(), 10);

  if (oWidth / oHeight === aspect) {
    return src;
  } else if (oWidth / oHeight > aspect) {
    cHeight = oHeight;
    cWidth = Math.floor(cHeight * aspect);
  } else {
    cWidth = oWidth;
    cHeight = Math.floor(cWidth / aspect);
  }

  const offsetX = Math.floor((oWidth - cWidth) / 2);

  // position === 'top'
  let offsetY = 0;

  if (position === 'center') {
    offsetY = Math.floor((oHeight - cHeight) / 2);
  }

  return `${src}?x-oss-process=image/crop,x_${offsetX},y_${offsetY},w_${cWidth},h_${cHeight}`;
};
