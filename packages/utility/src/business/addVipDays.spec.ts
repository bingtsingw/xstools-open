import { describe, expect, test } from 'bun:test';
import { addDays, ot, startOfDay } from '../_exports/date-fns';
import { ParamError } from '../error';
import { addVipDays } from './addVipDays';

describe('addVipDays', () => {
  test('赠送到当日结束', () => {
    expect(addVipDays({ vipTo: '2099-01-01 15:59:00', duration: 0, offset: '+08:00' }).toISOString()).toBe(
      '2099-01-01T16:00:00.000Z',
    );
    expect(addVipDays({ vipTo: '2099-01-01 16:00:00', duration: 0, offset: '+08:00' }).toISOString()).toBe(
      '2099-01-02T16:00:00.000Z',
    );
    expect(addVipDays({ vipTo: '2098-12-31 23:59:59', duration: 0, offset: '+00:00' }).toISOString()).toBe(
      '2099-01-01T00:00:00.000Z',
    );
    expect(addVipDays({ vipTo: '2099-01-01 00:00:00', duration: 0, offset: '+00:00' }).toISOString()).toBe(
      '2099-01-02T00:00:00.000Z',
    );
  });

  test('会员续费 / 新增 / 过期 / 退款', () => {
    expect(addVipDays({ vipTo: '2099-01-01 16:00:00', duration: 20, offset: '+08:00' }).toISOString()).toBe(
      '2099-01-22T16:00:00.000Z',
    );

    expect(addVipDays({ duration: 0, offset: '+08:00' }).toISOString()).toBe(
      addDays(startOfDay(new Date(), { in: ot('+08:00') }), 1).toISOString(),
    );
    expect(addVipDays({ duration: 30, offset: '+08:00' }).toISOString()).toBe(
      addDays(startOfDay(new Date(), { in: ot('+08:00') }), 31).toISOString(),
    );

    expect(addVipDays({ vipTo: '2000-01-01', duration: 0, offset: '+08:00' }).toISOString()).toBe(
      addDays(startOfDay(new Date(), { in: ot('+08:00') }), 1).toISOString(),
    );
    expect(addVipDays({ vipTo: '2000-01-01', duration: 30, offset: '+08:00' }).toISOString()).toBe(
      addDays(startOfDay(new Date(), { in: ot('+08:00') }), 31).toISOString(),
    );

    expect(addVipDays({ vipTo: '2099-12-31 16:00:00', duration: -1, offset: '+08:00' }).toISOString()).toBe(
      '2099-12-29T16:00:00.000Z',
    );
    expect(addVipDays({ vipTo: '2099-12-31 15:59:59', duration: -1, offset: '+08:00' }).toISOString()).toBe(
      '2099-12-28T16:00:00.000Z',
    );

    expect(
      addVipDays({
        vipTo: addVipDays({ duration: 30, offset: '+08:00' }).toISOString(),
        duration: -30,
        offset: '+08:00',
      }).toISOString(),
    ).toBe(startOfDay(new Date(), { in: ot('+08:00') }).toISOString());
    expect(
      addVipDays({
        vipTo: addVipDays({ vipTo: '2099-12-31T16:00:00.000Z', duration: 30, offset: '+08:00' }).toISOString(),
        duration: -30,
        offset: '+08:00',
      }).toISOString(),
    ).toBe('2099-12-31T16:00:00.000Z');

    // 特殊逻辑: 如果到期时间不是 24 点, 那么实际减少时间会多一天
    expect(
      addVipDays({
        vipTo: addVipDays({ vipTo: '2099-12-31T15:00:00.000Z', duration: 30, offset: '+08:00' }).toISOString(),
        duration: -30,
        offset: '+08:00',
      }).toISOString(),
    ).toBe('2099-12-30T16:00:00.000Z');
  });

  test('rejects invalid duration / vipTo / offset', () => {
    expect(() => addVipDays({ duration: Number.NaN, offset: '+08:00' })).toThrow(ParamError);
    expect(() => addVipDays({ duration: Number.POSITIVE_INFINITY, offset: '+08:00' })).toThrow(ParamError);
    expect(() => addVipDays({ vipTo: 'not-a-date', duration: 1, offset: '+08:00' })).toThrow(ParamError);
    expect(() => addVipDays({ duration: 1, offset: 'Asia/Shanghai' })).toThrow(ParamError);
  });
});
