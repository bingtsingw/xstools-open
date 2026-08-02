/**
 * 去掉地址中成对括号及其内容（含中英文括号种类）。
 *
 * @param address - 原始地址
 * @returns 去除括号段后的地址
 */
export const addressTrimParenthesis = (address: string): string => {
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

/**
 * 裁切地址尾部，保留到「街/道/路 + 门牌号」为止。
 *
 * @param address - 原始地址
 * @returns 裁切后的地址
 *
 * @example
 * addressTrimEnd('科技园路0号附近') // => '科技园路0号'
 */
export const addressTrimEnd = (address: string): string => {
  return address.replace(/((?:街|道|路)\d+号).*/, '$1');
};

/**
 * 判断区划名是否可与标题一起使用。
 *
 * 若 `title` 从第 0～3 个字符起的后缀以 `district`（或去掉「区」后的名）开头，
 * 视为标题已带区名，不能再加地区前缀了，返回 `false`；否则返回 `true`。
 */
export const isDistrictAcceptable = ({ title, district }: { title: string; district: string }): boolean => {
  const trimmedDistrict = district.replace('区', '');
  for (let i = 0; i <= 3; i++) {
    if (title.slice(i).startsWith(district) || title.slice(i).startsWith(trimmedDistrict)) {
      return false;
    }
  }

  return true;
};

/**
 * 获取地址中的区域。
 *
 * 若解析出的区划与 `title` 前缀冲突（见 `isDistrictAcceptable`），返回空字符串。
 *
 * @example
 * getDistrict({ address: "广东省深圳市罗湖区科技园路0号" }) // => 罗湖区
 * getDistrict({ address: "广东省深圳市罗湖区科技园路0号", title: "罗湖星巴克" }) // => ""
 */
export const getDistrict = ({ title = '', address }: { title?: string; address?: string }): string => {
  if (!address) {
    return '';
  }

  const cleanedAddress = addressTrimEnd(addressTrimParenthesis(address));

  const regex =
    /(?<province>[^省]+省|.+自治区|[^澳门]+澳门|[^香港]+香港|[^市]+市)?(?<prefecture>[^自治州]+自治州|[^特别行政区]+特别行政区|[^市]+市|.*?地区|.*?行政单位|.+盟|市辖区|[^县]+县)(?<district>[^县]+县|[^市]+市|[^镇]+镇|[^区]+区|[^乡]+乡|.+场|.+旗|.+海域|.+岛)?(?<rest>.*)/;
  const match = cleanedAddress.match(regex);

  const district = match?.groups?.['district'];
  if (district && isDistrictAcceptable({ title, district })) {
    return district;
  }

  return '';
};
