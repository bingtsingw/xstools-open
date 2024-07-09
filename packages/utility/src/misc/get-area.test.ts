import { draw } from '@xstools/radash';
import { describe, expect, test } from 'bun:test';
import { getArea } from './get-area';

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

describe('getArea', () => {
  test('随机标准地址', () => {
    randomAddresses().forEach(({ address, area }) => expect(getArea({ address, title: '星巴克' })).toBe(area));
  });

  test('合法地址', () => {
    const cases = [
      {
        address: '北京市北京市大兴区行远街道101号',
        title: '星巴克',
        expected: '大兴区',
      },

      {
        address: '上海市普陀区曹杨路1040弄1-2号',
        title: '伟龙商务楼',
        expected: '普陀区',
      },
      {
        address: '重庆市渝北区洪湖东路1号',
        title: '财富MALL',
        expected: '渝北区',
      },
      {
        address: '广东省深圳市罗湖区宝安南路1881号',
        title: '深圳万象城',
        expected: '罗湖区',
      },
    ];

    cases.forEach(({ address, title, expected }) => expect(getArea({ address, title })).toBe(expected));
  });

  test('合法地址：title为空', () => {
    const cases = [
      {
        address: '北京市北京市大兴区行远街道101号',
        title: '',
        expected: '',
      },
      {
        address: '北京市西城区复兴门内大街101号',
        title: '',
        expected: '',
      },
    ];

    cases.forEach(({ address, title, expected }) => expect(getArea({ address, title })).toBe(expected));
  });

  test('非法地址：title包含区（return ""）', () => {
    const cases = [
      {
        address: '北京市北京市大兴区行远街道101号',
        title: '大兴星巴克',
        expected: '',
      },
      {
        address: '上海市普陀区曹杨路1040弄1-2号',
        title: '(普陀)伟龙商务楼',
        expected: '',
      },
      {
        address: '重庆市渝北区洪湖东路1号',
        title: '(渝北区)财富MALL',
        expected: '',
      },
      {
        address: '广东省深圳市福田区莲花街道红荔路6030号',
        title: '(福田区)莲花山公园',
        expected: '',
      },
    ];

    cases.forEach(({ address, title, expected }) => expect(getArea({ address, title })).toBe(expected));
  });
  test('非法地址：address为空（return ""）', () => {
    const cases = [
      {
        address: '',
        title: '大兴星巴克',
        expected: '',
      },
      {
        address: '-2号',
        title: '(普陀)伟龙商务楼',
        expected: '',
      },
      {
        address: '',
        title: '(渝北区)财富MALL',
        expected: '',
      },
    ];

    cases.forEach(({ address, title, expected }) => expect(getArea({ address, title })).toBe(expected));
  });

  test('其他地址：随时补充', () => {
    const cases = [
      {
        address: '上海市上海市黄浦区南京西路325号上海市历史博物馆内',
        title: 'MAPOLY COFFEE满坡栗咖啡(上海历史博物馆臻选店）',
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
    ];
    cases.forEach(({ address, title, expected }) => expect(getArea({ address, title })).toBe(expected));
  });
});
