import { describe, expect, test } from 'bun:test';
import { format } from 'date-fns';
import { oid } from './oid';

describe('oid', () => {
  test('oid', () => {
    const _oid = oid();

    expect(_oid).toStartWith(format(new Date(), 'yyMMdd'));
    expect(_oid.length).toEqual(20);
  });
});
