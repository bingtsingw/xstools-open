export const addressTrimParenthesis = (address: string) => {
  const brackets = ['()', '[]', '{}', '<>', '（）', '【】', '｛｝', '《》', '〈〉', '〔〕', '〖〗', '〘〙'];
  const left: string[] = [];
  const right: string[] = [];

  brackets.forEach((bracket) => {
    const [open, close] = bracket.split('').filter((bracket) => bracket.trim());
    left.push(open!);
    right.push(close!);
  });

  const regexParts = left.flatMap((open) => right.map((close) => `\\${open}[^\\${open}\\${close}]*\\${close}`));

  const regexPattern = regexParts.join('|');
  return address.replace(new RegExp(regexPattern, 'g'), '');
};

export const addressTrimEnd = (address: string) => {
  return address.replace(/((?:街|道|路)\d+号).*/, '$1');
};

/**
 * 判断是否为有效的区域
 * - 如果 title 中从第 0 到第 3 个字符开始的子串与 district 或去掉“区”后的 district 相匹配，则认为无效。
 * - 后续可以添加更多的规则
 */
export const districtStartWith = ({ title, district }: { title: string; district: string }): boolean => {
  const trimmedDistrict = district.replace('区', '');
  for (let i = 0; i <= 3; i++) {
    if (title.slice(i).startsWith(district) || title.slice(i).startsWith(trimmedDistrict)) {
      return false;
    }
  }

  return true;
};

/**
 * 获取地址中的区域
 * - 如果 title 中从第 0 到第 3 个字符开始的子串与 district 或去掉“区”后的 district 相匹配，则认为无效。
 * @example
 * getDistance({ address: "广东省深圳市罗湖区科技园路0号" }) // => 罗湖区
 * getDistance({ address: "广东省深圳市罗湖区科技园路0号", title: "罗湖星巴克" }) // => ""
 */
export const getDistrict = ({ title = '', address }: { title?: string; address?: string }): string => {
  if (!address) {
    return '';
  }

  const cleanedAddress = addressTrimEnd(addressTrimParenthesis(address));

  const regex =
    /(?<_>[^省]+省|.+自治区|[^澳门]+澳门|[^香港]+香港|[^市]+市)?(?<__>[^自治州]+自治州|[^特别行政区]+特别行政区|[^市]+市|.*?地区|.*?行政单位|.+盟|市辖区|[^县]+县)(?<district>[^县]+县|[^市]+市|[^镇]+镇|[^区]+区|[^乡]+乡|.+场|.+旗|.+海域|.+岛)?(?<___>.*)/;
  const match = cleanedAddress.match(regex);

  const district = match?.groups?.['district'];
  if (district) {
    if (districtStartWith({ title, district })) {
      return district;
    }
  }

  return '';
};
