import { draw } from '@xstools/radash';
import { describe, expect, test } from 'bun:test';
import { addressTrimEnd, addressTrimParenthesis, districtStartWith, getDistrict } from './get-district';

const randomAddresses = () => {
  const provinces = ['广东省', '北京市', '上海市', '重庆市'];
  const cities = ['深圳市', '北京市', '上海市', '重庆市'];
  const areas = ['朝阳区', '海淀区', '西城区', '东城区', '大兴区', '丰台区', '昌平区', '通州区'];
  const streets = ['和平街', '长安街', '园林路', '光明路', '科技园路', '建国路', '民主路', '行远街'];

  const addresses = [];
  for (let i = 0; i < 100; i++) {
    const province = draw(provinces)!;
    const city = draw(cities)!;
    const area = draw(areas)!;
    const street = draw(streets)!;
    const number = Math.floor(Math.random() * 500) + 1;
    const address = `${province}${city}${area}${street}${number}号`;

    addresses.push({ address: address, area: area });
  }

  return addresses;
};

describe('misc', () => {
  test('getDistrict', () => {
    // 随机标准地址
    randomAddresses().forEach(({ address, area }) => expect(getDistrict({ address, title: '星巴克' })).toBe(area));

    // 合法地址
    [
      {
        address: '北京市北京市大兴区行远街道101号',
        title: '星巴克',
        expected: '大兴区',
      },

      {
        address: '北京市北京市大兴区行远街道101号',
        title: '',
        expected: '',
      },
    ].forEach(({ address, title, expected }) => expect(getDistrict({ address, title })).toBe(expected));

    // 非法地址
    [
      {
        address: '北京市北京市大兴区行远街道101号',
        title: '大兴星巴克',
        expected: '',
      },
      {
        address: '',
        title: '大兴星巴克',
        expected: '',
      },
    ].forEach(({ address, title, expected }) => expect(getDistrict({ address, title })).toBe(expected));

    // 其他地址：随时补充
    [
      {
        address: '上海市上海市黄浦区南京西路325号上海市历史博物馆内',
        title: 'COFFEE满坡栗咖啡(上海历史博物馆臻选店）',
        expected: '黄浦区',
      },
      {
        address: '上海市静安区乌鲁木齐北路4号(近市西中学后门)',
        title: 'SilverFlow银流咖啡(元善里店)',
        expected: '静安区',
      },
      {
        address: '吉林省长春市朝阳区吉大南校北门致远街408号',
        title: 'Im Fine Cafe Bar 吉林省长春市朝阳区吉大南校',
        expected: '朝阳区',
      },
    ].forEach(({ address, title, expected }) => expect(getDistrict({ address, title })).toBe(expected));
  });

  test('addressTrimParenthesis', () => {
    expect(addressTrimParenthesis('hello')).toBe('hello');
    expect(addressTrimParenthesis('北京市海淀区知春路[五道口]10号')).toBe('北京市海淀区知春路10号');
    expect(addressTrimParenthesis('上海市黄浦区南京东路100号(步行街)')).toBe('上海市黄浦区南京东路100号');
    expect(addressTrimParenthesis('深圳市南山区高新南一道(软件园)[南门]300号')).toBe('深圳市南山区高新南一道300号');
  });

  test('addressTrimEnd', () => {
    expect(addressTrimEnd('hello')).toBe('hello');
    expect(addressTrimEnd('北京市海淀区知春路10号xxxx')).toBe('北京市海淀区知春路10号');
  });

  test('districtStartWith', () => {
    expect(districtStartWith({ title: '朝阳区xx酒吧', district: '朝阳区' })).toBeFalse();
    expect(districtStartWith({ title: 'xx朝阳区xx酒吧', district: '朝阳区' })).toBeFalse();
    expect(districtStartWith({ title: 'xxx朝阳区xx酒吧', district: '朝阳区' })).toBeFalse();

    expect(districtStartWith({ title: 'xxxx朝阳区xx酒吧', district: '朝阳区' })).toBeTrue();
    expect(districtStartWith({ title: 'xx酒吧', district: '朝阳区' })).toBeTrue();
  });
});
