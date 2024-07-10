export const trimParenthesis = (address: string) => {
  const brackets = '(), [], {}, <>,（）,【】,｛｝,《》,〈〉,〔〕,〖〗,〘〙';
  const pairs = brackets.split(',').map((pair) => pair.trim());
  const left: string[] = [];
  const right: string[] = [];

  pairs.forEach((pair) => {
    const [open, close] = pair.split('').filter((char) => char.trim());
    left.push(open!);
    right.push(close!);
  });

  const regexParts = left.flatMap((open) => right.map((close) => `\\${open}[^\\${open}\\${close}]*\\${close}`));

  const regexPattern = regexParts.join('|');
  return address.replace(new RegExp(regexPattern, 'g'), '');
};

export const trimStreetEnd = (address: string) => {
  return address.replace(/((?:街|道|路)\d+号).*/, '$1');
};

/**
 * 判断是否为有效的区域
 * - 如果 title 中从第 0 到第 3 个字符开始的子串与 district 或去掉“区”后的 district 相匹配，则认为无效。
 * - 后续可以添加更多的规则
 */
export const isValidDistrict = ({ title, district }: { title: string; district: string }): boolean => {
  const trimmedDistrict = district.replace('区', '');
  for (let i = 0; i <= 3; i++) {
    if (title.slice(i).startsWith(district) || title.slice(i).startsWith(trimmedDistrict)) {
      return false;
    }
  }

  return true;
};

export const getArea = ({ title, address }: { title?: string; address?: string }): string => {
  if (!address || !title) {
    return '';
  }

  const cleanedAddress = trimStreetEnd(trimParenthesis(address));

  const regex =
    /(?<_>[^省]+省|.+自治区|[^澳门]+澳门|[^香港]+香港|[^市]+市)?(?<__>[^自治州]+自治州|[^特别行政区]+特别行政区|[^市]+市|.*?地区|.*?行政单位|.+盟|市辖区|[^县]+县)(?<district>[^县]+县|[^市]+市|[^镇]+镇|[^区]+区|[^乡]+乡|.+场|.+旗|.+海域|.+岛)?(?<___>.*)/;
  const match = cleanedAddress.match(regex);

  const district = match?.groups?.['district'];
  if (district) {
    if (isValidDistrict({ title, district })) {
      return district;
    }
  }

  return '';
};
