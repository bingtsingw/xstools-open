import { describe, expect, test } from 'bun:test';
import { startOfDayInTimeZone, startOfMonthInTimeZone } from './fns-tz';

describe('fns-tz', () => {
  test('startOfDayInTimeZone', () => {
    expect(startOfDayInTimeZone({ date: '2000-01-01', offset: '+00:00' }).toISOString()).toBe(
      '2000-01-01T00:00:00.000Z',
    );

    // 01-01
    console.log('a');
    expect(startOfDayInTimeZone({ date: '2000-01-01 15:59:00', offset: '+08:00' }).toISOString()).toBe(
      '1999-12-31T16:00:00.000Z',
    );
    console.log('b');
    expect(startOfDayInTimeZone({ date: '2000-01-01T15:59:00.000Z', offset: '+08:00' }).toISOString()).toBe(
      '1999-12-31T16:00:00.000Z',
    );

    // 01-02
    console.log('c');
    expect(startOfDayInTimeZone({ date: '2000-01-01 16:01:00', offset: '+08:00' }).toISOString()).toBe(
      '2000-01-01T16:00:00.000Z',
    );
    console.log('d');
    expect(startOfDayInTimeZone({ date: '2000-01-01T16:01:00.000Z', offset: '+08:00' }).toISOString()).toBe(
      '2000-01-01T16:00:00.000Z',
    );
  });

  test('startOfMonthInTimeZone', () => {
    expect(startOfMonthInTimeZone({ date: '2000-01-01', offset: '+00:00' }).toISOString()).toBe(
      '2000-01-01T00:00:00.000Z',
    );

    // 01-01
    expect(startOfMonthInTimeZone({ date: '2000-01-01 15:59:00', offset: '+08:00' }).toISOString()).toBe(
      '1999-12-31T16:00:00.000Z',
    );

    // 01-31
    expect(startOfMonthInTimeZone({ date: '2000-01-31 15:01:00', offset: '+08:00' }).toISOString()).toBe(
      '1999-12-31T16:00:00.000Z',
    );

    // 02-01
    expect(startOfMonthInTimeZone({ date: '2000-01-31 16:01:00', offset: '+08:00' }).toISOString()).toBe(
      '2000-01-31T16:00:00.000Z',
    );
  });

  // test('addVipDays', () => {
  //   // 赠送到当日结束
  //   expect(addVipDays({ vipTo: '2099-01-01 15:59:00', duration: 0, offset: '+08:00' }).toISOString()).toBe(
  //     '2099-01-01T16:00:00.000Z',
  //   );
  //   expect(addVipDays({ vipTo: '2099-01-01 16:00:00', duration: 0, offset: '+08:00' }).toISOString()).toBe(
  //     '2099-01-02T16:00:00.000Z',
  //   );
  //   expect(addVipDays({ vipTo: '2098-12-31 23:59:59', duration: 0, offset: '+00:00' }).toISOString()).toBe(
  //     '2099-01-01T00:00:00.000Z',
  //   );
  //   expect(addVipDays({ vipTo: '2099-01-01 00:00:00', duration: 0, offset: '+00:00' }).toISOString()).toBe(
  //     '2099-01-02T00:00:00.000Z',
  //   );

  //   // 增加时间: 会员续费
  //   expect(addVipDays({ vipTo: '2099-01-01 16:00:00', duration: 20, offset: '+08:00' }).toISOString()).toBe(
  //     '2099-01-22T16:00:00.000Z',
  //   );

  //   // 增加时间: 会员新增
  //   expect(addVipDays({ duration: 0, offset: '+08:00' }).toISOString()).toBe(
  //     addDays(startOfDayInTimeZone({ offset: '+08:00' }), 1).toISOString(),
  //   );
  //   expect(addVipDays({ duration: 30, offset: '+08:00' }).toISOString()).toBe(
  //     addDays(startOfDayInTimeZone({ offset: '+08:00' }), 31).toISOString(),
  //   );

  //   // 增加时间: 会员过期
  //   expect(addVipDays({ vipTo: '2000-01-01', duration: 0, offset: '+08:00' }).toISOString()).toBe(
  //     addDays(startOfDayInTimeZone({ offset: '+08:00' }), 1).toISOString(),
  //   );
  //   expect(addVipDays({ vipTo: '2000-01-01', duration: 30, offset: '+08:00' }).toISOString()).toBe(
  //     addDays(startOfDayInTimeZone({ offset: '+08:00' }), 31).toISOString(),
  //   );

  //   // 减少时间: 时间充足
  //   expect(addVipDays({ vipTo: '2099-12-31 16:00:00', duration: -1, offset: '+08:00' }).toISOString()).toBe(
  //     '2099-12-29T16:00:00.000Z',
  //   );
  //   expect(addVipDays({ vipTo: '2099-12-31 15:59:59', duration: -1, offset: '+08:00' }).toISOString()).toBe(
  //     '2099-12-28T16:00:00.000Z',
  //   );

  //   // 如果一个人先购买再退款, 要保证他回到原点
  //   expect(
  //     addVipDays({
  //       vipTo: addVipDays({ duration: 30, offset: '+08:00' }).toISOString(),
  //       duration: -30,
  //       offset: '+08:00',
  //     }).toISOString(),
  //   ).toBe(startOfDayInTimeZone({ offset: '+08:00' }).toISOString());
  //   expect(
  //     addVipDays({
  //       vipTo: addVipDays({ vipTo: '2099-12-31T16:00:00.000Z', duration: 30, offset: '+08:00' }).toISOString(),
  //       duration: -30,
  //       offset: '+08:00',
  //     }).toISOString(),
  //   ).toBe('2099-12-31T16:00:00.000Z');

  //   // 特殊逻辑: 如果到期时间不是24点, 那么实际减少时间会多一天, 当然如果业务中所有到期时间都用24点表示, 则不会出现这个问题
  //   expect(
  //     addVipDays({
  //       vipTo: addVipDays({ vipTo: '2099-12-31T15:00:00.000Z', duration: 30, offset: '+08:00' }).toISOString(),
  //       duration: -30,
  //       offset: '+08:00',
  //     }).toISOString(),
  //   ).toBe('2099-12-30T16:00:00.000Z'); // 31号白天的时间被吞了
  // });
});
