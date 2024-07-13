import { describe, expect, test } from 'bun:test';
import { addressTrimEnd, addressTrimParenthesis, districtStartWith, getDistrict } from './get-district';

describe('misc', () => {
  test('getDistrict', () => {
    // 标准地址
    [
      {
        address: '北京市北京市大兴区行远街道101号',
        title: '星巴克',
        expected: '大兴区',
      },

      {
        address: '广东省深圳市罗湖区科技园路0号',
        title: '',
        expected: '罗湖区',
      },
      {
        address: '北京市北京市大兴区行远街道101号',
        title: '大兴星巴克',
        expected: '',
      },
    ].forEach(({ address, title, expected }) => expect(getDistrict({ address, title })).toEqual(expected));

    // 特殊地址
    [
      {
        address: '',
        title: '',
        expected: '',
      },
      {
        address: '',
        title: '大兴星巴克',
        expected: '',
      },
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
    ].forEach(({ address, title, expected }) => expect(getDistrict({ address, title })).toEqual(expected));
  });

  test('addressTrimParenthesis', () => {
    expect(addressTrimParenthesis('hello')).toEqual('hello');
    expect(addressTrimParenthesis('北京市海淀区知春路[五道口]10号')).toEqual('北京市海淀区知春路10号');
    expect(addressTrimParenthesis('上海市黄浦区南京东路100号(步行街)')).toEqual('上海市黄浦区南京东路100号');
    expect(addressTrimParenthesis('深圳市南山区高新南一道(软件园)[南门]300号')).toEqual('深圳市南山区高新南一道300号');
  });

  test('addressTrimEnd', () => {
    expect(addressTrimEnd('hello')).toEqual('hello');
    expect(addressTrimEnd('北京市海淀区知春路10号xxxx')).toEqual('北京市海淀区知春路10号');
  });

  test('districtStartWith', () => {
    expect(districtStartWith({ title: '朝阳区xx酒吧', district: '朝阳区' })).toBeFalse();
    expect(districtStartWith({ title: 'xx朝阳区xx酒吧', district: '朝阳区' })).toBeFalse();
    expect(districtStartWith({ title: 'xxx朝阳区xx酒吧', district: '朝阳区' })).toBeFalse();

    expect(districtStartWith({ title: 'xxxx朝阳区xx酒吧', district: '朝阳区' })).toBeTrue();
    expect(districtStartWith({ title: 'xx酒吧', district: '朝阳区' })).toBeTrue();
  });
});
