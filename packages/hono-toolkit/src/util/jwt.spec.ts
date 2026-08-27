import { afterEach, describe, expect, setSystemTime, test } from 'bun:test';
import { sign } from 'hono/jwt';
import { CLOCK_SKEW, jwtExtractSub, jwtResponse, jwtSign, jwtVerify } from './jwt';

/** jwtSign 固定 nbf = iat - CLOCK_SKEW；要测任意 nbf/iat 或缺字段，只能直接 sign。 */
const signRaw = (payload: Record<string, unknown>, secret = 'secret') => sign(payload, secret, 'HS256');

const ctxWithAuth = (authorization?: string) =>
  ({
    req: { header: () => authorization },
  }) as any;

describe('jwt', () => {
  afterEach(() => {
    setSystemTime();
  });

  describe('jwtVerify nbf/iat', () => {
    test('accepts nbf and iat at the current unix time', async () => {
      const now = new Date('2026-01-01T00:00:00.000Z');
      setSystemTime(now);
      const unix = Math.floor(now.getTime() / 1000);
      const token = await signRaw({ sub: 'authId', exp: unix + 60, nbf: unix, iat: unix });

      expect(await jwtVerify({ secret: 'secret', token })).toEqual({
        sub: 'authId',
        exp: unix + 60,
        nbf: unix,
        iat: unix,
      });
    });

    test('rejects token before nbf', async () => {
      const now = new Date('2026-01-01T00:00:00.000Z');
      setSystemTime(now);
      const unix = Math.floor(now.getTime() / 1000);
      const token = await signRaw({ sub: 'authId', exp: unix + 120, nbf: unix + 1, iat: unix });

      expect(jwtVerify({ secret: 'secret', token })).rejects.toThrow("before it's valid");
    });

    test('rejects token with future iat', async () => {
      const now = new Date('2026-01-01T00:00:00.000Z');
      setSystemTime(now);
      const unix = Math.floor(now.getTime() / 1000);
      const token = await signRaw({ sub: 'authId', exp: unix + 120, nbf: unix, iat: unix + 1 });

      expect(jwtVerify({ secret: 'secret', token })).rejects.toThrow('Invalid "iat" claim');
    });

    test('rejects payload missing nbf or iat', async () => {
      const now = new Date('2026-01-01T00:00:00.000Z');
      setSystemTime(now);
      const unix = Math.floor(now.getTime() / 1000);

      const withoutNbf = await signRaw({ sub: 'authId', exp: unix + 60, iat: unix });
      expect(jwtVerify({ secret: 'secret', token: withoutNbf })).rejects.toThrow('invalid jwt payload');

      const withoutIat = await signRaw({ sub: 'authId', exp: unix + 60, nbf: unix });
      expect(jwtVerify({ secret: 'secret', token: withoutIat })).rejects.toThrow('invalid jwt payload');
    });
  });

  describe('jwtSign', () => {
    test('sets nbf before iat and expires after expiresIn', async () => {
      const secret = 'secret';
      const authId = 'authId';

      const signedAt = Date.now();
      const token = await jwtSign({ secret, sub: authId, expiresIn: 60 });

      expect(token).toStartWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

      const payload = await jwtVerify({ secret, token });
      expect(payload).toMatchObject({ sub: authId });
      expect(payload.exp).toBeGreaterThan(payload.iat);
      expect(payload.nbf).toEqual(payload.iat - CLOCK_SKEW);

      setSystemTime(new Date(signedAt + 59 * 1000));
      expect(await jwtVerify({ secret, token })).toMatchObject({ sub: authId });

      setSystemTime(new Date(signedAt + 61 * 1000));
      expect(jwtVerify({ secret, token })).rejects.toThrow('expired');
    });

    test('CLOCK_SKEW keeps nbf valid when verifier clock is behind', async () => {
      const signedAt = new Date('2026-01-01T00:00:00.000Z');
      setSystemTime(signedAt);
      const unix = Math.floor(signedAt.getTime() / 1000);
      const secret = 'secret';

      const withoutSkew = await signRaw({ sub: 'authId', exp: unix + 120, nbf: unix, iat: unix });
      const withSkew = await jwtSign({ secret, sub: 'authId', expiresIn: 120 });

      expect((await jwtVerify({ secret, token: withSkew })).nbf).toEqual(unix - CLOCK_SKEW);

      setSystemTime(new Date(signedAt.getTime() - 1000));
      expect(jwtVerify({ secret, token: withoutSkew })).rejects.toThrow("before it's valid");
      expect(jwtVerify({ secret, token: withSkew })).rejects.toThrow('Invalid "iat" claim');

      setSystemTime(new Date(signedAt.getTime() - CLOCK_SKEW * 1000));
      expect(jwtVerify({ secret, token: withSkew })).rejects.toThrow('Invalid "iat" claim');

      setSystemTime(new Date(signedAt.getTime() - (CLOCK_SKEW + 1) * 1000));
      expect(jwtVerify({ secret, token: withSkew })).rejects.toThrow("before it's valid");
    });
  });

  test('jwtVerify rejects wrong secret', async () => {
    const token = await jwtSign({ secret: 'secret', sub: 'authId', expiresIn: 60 });
    expect(jwtVerify({ secret: 'other', token })).rejects.toThrow();
  });

  test('jwtResponse', async () => {
    expect(jwtResponse({ token: 'abc123' })).toEqual({ token: 'abc123', type: 'Bearer' });
    expect(jwtResponse({ token: '' })).toEqual({ token: '', type: 'Bearer' });
    expect(jwtResponse({ token: '1234567890' })).toEqual({ token: '1234567890', type: 'Bearer' });
  });

  test('jwtExtractSub reads Bearer token and raw token', async () => {
    const secret = 'secret';
    const token = await jwtSign({ secret, sub: 'authId', expiresIn: 60 });

    expect(await jwtExtractSub({ secret, ctx: ctxWithAuth(`Bearer ${token}`) })).toEqual('authId');
    expect(await jwtExtractSub({ secret, ctx: ctxWithAuth(`bearer ${token}`) })).toEqual('authId');
    expect(await jwtExtractSub({ secret, ctx: ctxWithAuth(token) })).toEqual('authId');
  });

  test('jwtExtractSub returns false when auth is missing or invalid', async () => {
    const secret = 'secret';
    const token = await jwtSign({ secret, sub: 'authId', expiresIn: 60 });

    expect(await jwtExtractSub({ secret, ctx: ctxWithAuth() })).toEqual(false);
    expect(await jwtExtractSub({ secret, ctx: ctxWithAuth('') })).toEqual(false);
    expect(await jwtExtractSub({ secret, ctx: ctxWithAuth('Bearer bad') })).toEqual(false);
    expect(await jwtExtractSub({ secret: 'other', ctx: ctxWithAuth(`Bearer ${token}`) })).toEqual(false);
  });
});
