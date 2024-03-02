import { number, object, safeParse } from 'valibot';
import { Exception } from '../exception';

const vPoint = object({
  latitude: number(),
  longitude: number(),
});

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

/**
 * 计算两个坐标点之间距离（单位M）
 * https://mixbit.xyz/post/javascript-calculates-the-distance-between-two-points-of-coordinates.html
 *
 * @param {object} point1 坐标点1
 * @param {string} point1.longitude 经度
 * @param {string} point1.latitude 纬度
 * @param {object} point2 坐标点2
 * @param {string} point2.longitude 经度
 * @param {string} point2.latitude 纬度
 */
export const getDistance = (
  point1: { latitude: number; longitude: number },
  point2: { latitude: number; longitude: number },
) => {
  if (!safeParse(vPoint, point1).success || !safeParse(vPoint, point2).success) {
    throw new Exception.BadRequestException('坐标参数错误');
  }

  // 将两个点的纬度转换为弧度
  const radLat1 = deg2rad(point1.latitude);
  const radLat2 = deg2rad(point2.latitude);

  // 计算两个点的纬度差和经度差
  const latDiff = radLat1 - radLat2;
  const lngDiff = deg2rad(point1.longitude) - deg2rad(point2.longitude);

  // 使用Haversine公式计算两点间的大圆距离
  let distance =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(latDiff / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(lngDiff / 2), 2),
      ),
    );

  // 将距离乘以地球半径（米）
  distance = distance * 6378137;
  // 四舍五入到小数点后两位
  distance = Math.round(distance * 100) / 100;

  // 返回距离（米）
  return distance;
};
