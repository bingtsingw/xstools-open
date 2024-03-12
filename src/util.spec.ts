import { describe, expect, test } from 'bun:test';
import { getDistrictFromAddress } from './util';

const generateRandomAddresses = ({ provinces, cities }: { provinces: string[]; cities: string[] }, count: number) => {
  const districts = ['朝阳区', '海淀区', '西城区', '东城区', '大兴区', '丰台区', '昌平区', '通州区'];
  const streets = ['和平街', '长安街', '园林路', '光明路', '科技园路', '建国路', '民主路', '行远街'];
  const addresses = [];

  for (let i = 0; i < count; i++) {
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const district = districts[Math.floor(Math.random() * districts.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const number = Math.floor(Math.random() * 500) + 1;
    const address = `${province}${city}${district}${street}${number}号`;
    addresses.push({
      address: address,
      district: district as string,
    });
  }

  return addresses;
};

describe('getDistrictFromAddress', () => {
  test('基本随机地址', () => {
    const addresses = generateRandomAddresses(
      { provinces: ['广东省', '北京市', '上海市', '重庆市'], cities: ['深圳市', '北京市', '上海市', '重庆市'] },
      100,
    );
    addresses.forEach((address) => {
      const district = getDistrictFromAddress({
        address: address.address,
        title: '星巴克',
        cityWhiteList: ['深圳市', '北京市', '上海市', '重庆市'],
      });
      expect(district).toBe(address.district);
    });
  });
  const testCases = [
    {
      description: '合法地址',
      cases: [
        {
          address: '北京市北京市大兴区行远街道101号',
          title: '星巴克',
          cityWhiteList: ['北京市'],
          expected: '大兴区',
        },
        {
          address: '北京市西城区复兴门内大街101号',
          title: '百盛购物中心(复兴门店)',
          cityWhiteList: ['北京市'],
          expected: '西城区',
        },
        {
          address: '北京市东城区安定门外大街',
          title: '地坛公园',
          cityWhiteList: ['北京市'],
          expected: '东城区',
        },
        {
          address: '上海市普陀区曹杨路1040弄1-2号',
          title: '伟龙商务楼',
          cityWhiteList: ['上海市'],
          expected: '普陀区',
        },
        {
          address: '上海市静安区梅园路360号',
          title: '环龙商场',
          cityWhiteList: ['上海市'],
          expected: '静安区',
        },
        {
          address: '上海市黄浦区淮海中路282~283号',
          title: '上海香港广场',
          cityWhiteList: ['上海市'],
          expected: '黄浦区',
        },
        {
          address: '重庆市渝北区洪湖东路1号',
          title: '财富MALL',
          cityWhiteList: ['重庆市'],
          expected: '渝北区',
        },
        {
          address: '重庆市北部新区泰山大道东段62号',
          title: '动力时光购物中心',
          cityWhiteList: ['重庆市'],
          expected: '北部新区',
        },
        {
          address: '重庆市江北区观音桥步行街6号',
          title: '重庆新世界百货',
          cityWhiteList: ['重庆市'],
          expected: '江北区',
        },
        {
          address: '广东省深圳市福田区莲花街道红荔路6030号',
          title: '莲花山公园',
          cityWhiteList: ['深圳市'],
          expected: '福田区',
        },
        {
          address: '广东省深圳市罗湖区解放路2001号',
          title: '太阳百货',
          cityWhiteList: ['广东省'],
          expected: '罗湖区',
        },
        {
          address: '广东省深圳市罗湖区宝安南路1881号',
          title: '深圳万象城',
          cityWhiteList: ['广东省'],
          expected: '罗湖区',
        },
      ],
    },
    {
      description: '合法地址：title为空',
      cases: [
        {
          address: '北京市北京市大兴区行远街道101号',
          title: '',
          cityWhiteList: ['北京市'],
          expected: '大兴区',
        },
        {
          address: '北京市西城区复兴门内大街101号',
          title: '',
          cityWhiteList: ['北京市'],
          expected: '西城区',
        },
      ],
    },
    {
      description: '非法地址：不再白名单（return ""）',
      cases: [
        {
          address: '北京市北京市大兴区行远街道101号',
          title: '星巴克',
          cityWhiteList: ['上海市'],
          expected: '',
        },
        {
          address: '上海市普陀区曹杨路1040弄1-2号',
          title: '伟龙商务楼',
          cityWhiteList: ['北京市'],
          expected: '',
        },
        {
          address: '重庆市渝北区洪湖东路1号',
          title: '财富MALL',
          cityWhiteList: ['上海市'],
          expected: '',
        },
        {
          address: '广东省深圳市福田区莲花街道红荔路6030号',
          title: '莲花山公园',
          cityWhiteList: ['北京市'],
          expected: '',
        },
      ],
    },
    {
      description: '非法地址：title包含区（return ""）',
      cases: [
        {
          address: '北京市北京市大兴区行远街道101号',
          title: '大兴星巴克',
          cityWhiteList: ['北京市'],
          expected: '',
        },
        {
          address: '上海市普陀区曹杨路1040弄1-2号',
          title: '(普陀)伟龙商务楼',
          cityWhiteList: ['上海市'],
          expected: '',
        },
        {
          address: '重庆市渝北区洪湖东路1号',
          title: '(渝北区)财富MALL',
          cityWhiteList: ['重庆市'],
          expected: '',
        },
        {
          address: '广东省深圳市福田区莲花街道红荔路6030号',
          title: '(福田区)莲花山公园',
          cityWhiteList: ['广东省'],
          expected: '',
        },
        {
          address: '广东省深圳市福田区莲花街道红荔路6030号',
          title: '莲花山公园福田',
          cityWhiteList: ['广东省'],
          expected: '',
        },
        {
          address: '广东省深圳市福田区莲花街道红荔路6030号',
          title: '莲花山公园【福田】',
          cityWhiteList: ['广东省'],
          expected: '',
        },
      ],
    },
    {
      description: '非法地址：白名单为空（return ""）',
      cases: [
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
          cityWhiteList: [''],
          expected: '',
        },
        {
          address: '广东省深圳市福田区莲花街道红荔路6030号',
          title: '(福田区)莲花山公园',
          cityWhiteList: [''],
          expected: '',
        },
      ],
    },
    {
      description: '非法地址：address为空（return ""）',
      cases: [
        {
          address: '',
          title: '大兴星巴克',
          expected: '',
          cityWhiteList: ['北京市'],
        },
        {
          address: '-2号',
          title: '(普陀)伟龙商务楼',
          expected: '',
          cityWhiteList: ['北京市'],
        },
        {
          address: '',
          title: '(渝北区)财富MALL',
          cityWhiteList: [''],
          expected: '',
        },
        {
          address: '',
          title: '(福田区)莲花山公园',
          cityWhiteList: [''],
          expected: '',
        },
      ],
    },
  ];
  /* eslint-disable max-nested-callbacks */
  testCases.forEach(({ description, cases }) => {
    test(description, () => {
      cases.forEach(({ address, title, cityWhiteList, expected }) => {
        const district = getDistrictFromAddress({ address, title, cityWhiteList });
        expect(district).toBe(expected);
      });
    });
  });
});
