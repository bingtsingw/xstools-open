interface IOssImageCrop {
  src: string;
  width: number | string;
  height: number | string;
  aspect: number;
  position: 'center' | 'top';
}

export const ossImageCrop = ({ src, width, height, aspect, position = 'center' }: IOssImageCrop): string => {
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
