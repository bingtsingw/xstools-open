export const getArea = ({
  title,
  address,
  cityWhiteList,
}: {
  title: string;
  address?: string;
  cityWhiteList?: string[];
}): string => {
  if (!address) return '';

  const regex =
    /(?<province>[^省]+省|.+自治区|[^澳门]+澳门|[^香港]+香港|[^市]+市)?(?<city>[^自治州]+自治州|[^特别行政区]+特别行政区|[^市]+市|.*?地区|.*?行政单位|.+盟|市辖区|[^县]+县)(?<district>[^县]+县|[^市]+市|[^镇]+镇|[^区]+区|[^乡]+乡|.+场|.+旗|.+海域|.+岛)?(?<address>.*)/;
  const match: any = address.match(regex);
  if (match) {
    const { district } = match.groups as {
      district: string;
    };
    if (isValidDistrict({ title, district, cityWhiteList, locationGroups: match.groups })) {
      return district;
    }
  }

  return '';
};

function isValidDistrict({
  title,
  district,
  cityWhiteList,
  locationGroups,
}: {
  title: string;
  district: string;
  cityWhiteList: string[] | undefined;
  locationGroups: { province?: string; city?: string };
}): boolean {
  if (!district) return false;
  if (title.includes(district) || title.includes(district.replace('区', ''))) return false;
  if (!cityWhiteList || !cityWhiteList.length) return true;

  const { province, city } = locationGroups;
  return cityWhiteList.some((c) => province?.includes(c) || city?.includes(c));
}
