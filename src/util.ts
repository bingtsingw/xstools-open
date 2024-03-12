export const getDistrictFromAddress = ({
  title,
  address,
  cityWhiteList,
}: {
  title: string;
  address: string;
  cityWhiteList?: string[];
}): string => {
  if (cityWhiteList && Array.isArray(cityWhiteList) && cityWhiteList.length > 0) {
    const regex =
      /(?<province>[^省]+省|.+自治区|[^澳门]+澳门|[^香港]+香港|[^市]+市)?(?<city>[^自治州]+自治州|[^特别行政区]+特别行政区|[^市]+市|.*?地区|.*?行政单位|.+盟|市辖区|[^县]+县)(?<district>[^县]+县|[^市]+市|[^镇]+镇|[^区]+区|[^乡]+乡|.+场|.+旗|.+海域|.+岛)?(?<address>.*)/;
    const match = address.match(regex);
    if (match) {
      const { province, city, district } = match.groups as {
        province: string;
        city: string;
        district: string;
      };
      if (cityWhiteList.some((c) => province?.includes(c)) || cityWhiteList.some((c) => city?.includes(c))) {
        if (district && !title.includes(district) && !title.includes(district.replace('区', ''))) {
          return district;
        }
      }
    }
  }
  return '';
};
