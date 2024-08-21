import { describe, expect, test } from 'bun:test';
import { format } from 'date-fns';
import { oid } from './oid';

describe('oid', () => {
  test('normal usage', () => {
    expect(new Date('2022-01-01').toISOString().slice(2, 10).replace(/-/g, '')).toBe('220101');
    expect(new Date('2022-12-12').toISOString().slice(2, 10).replace(/-/g, '')).toBe('221212');

    const _oid = oid();

    expect(_oid.length).toEqual(20);

    expect(_oid).toStartWith(format(new Date(), 'yyMMdd'));
  });
});
