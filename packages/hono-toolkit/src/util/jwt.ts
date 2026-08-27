import type { Context } from 'hono';
import { sign, verify } from 'hono/jwt';

const ALG = 'HS256';
/** 签发时 nbf = iat - CLOCK_SKEW，避免对端时钟落后导致刚签发的 token 因 nbf 不可用。 */
export const CLOCK_SKEW = 60;

export interface JwtPayload {
  /** 主体，一般为用户 / 账号 id */
  sub: string;
  /** 过期时间，unix 秒 */
  exp: number;
  /** 生效时间，unix 秒。签发时为 iat 减去 clock skew */
  nbf: number;
  /** 签发时间，unix 秒 */
  iat: number;
}

export interface JwtResponse {
  /** JWT 字符串 */
  token: string;
  /** 认证方案，固定为 Bearer */
  type: string;
}

const toUnixTime = (date: Date) => Math.floor(date.getTime() / 1000);

/**
 * 签发 JWT（HS256）。
 *
 * @param options.secret 签名密钥
 * @param options.sub 写入 payload.sub 的主体
 * @param options.expiresIn 有效时长，单位秒（写入 payload.exp，不是 unix 时间戳）
 *
 * payload.nbf 为 iat 减去 CLOCK_SKEW 秒，允许对端时钟最多落后 CLOCK_SKEW 秒。
 */
export const jwtSign = async ({
  secret,
  sub,
  expiresIn,
}: {
  secret: string;
  sub: string;
  expiresIn: number;
}): Promise<string> => {
  const now = new Date();
  const iat = toUnixTime(now);
  return await sign(
    {
      sub,
      exp: toUnixTime(new Date(now.getTime() + expiresIn * 1000)),
      nbf: iat - CLOCK_SKEW,
      iat,
    },
    secret,
    ALG,
  );
};

/**
 * 校验 JWT，返回 payload。
 *
 * @returns payload.sub 主体；payload.exp 过期时间（unix 秒）；payload.nbf 生效时间（unix 秒）；payload.iat 签发时间（unix 秒）
 */
export const jwtVerify = async ({ secret, token }: { secret: string; token: string }): Promise<JwtPayload> => {
  const payload = await verify(token, secret, ALG);
  const sub = payload['sub'];
  const exp = payload['exp'];
  const nbf = payload['nbf'];
  const iat = payload['iat'];
  if (typeof sub !== 'string' || typeof exp !== 'number' || typeof nbf !== 'number' || typeof iat !== 'number') {
    throw new Error('invalid jwt payload');
  }

  return { sub, exp, nbf, iat };
};

/**
 * 组装登录响应里的 token 字段。
 *
 * @returns token JWT 字符串；type 固定为 Bearer
 */
export const jwtResponse = ({ token }: { token: string }): JwtResponse => {
  return {
    token,
    type: 'Bearer',
  };
};

/**
 * 从请求 Authorization 头取出 JWT 并校验，返回 payload.sub。
 *
 * @returns 主体字符串；缺头、格式错误或校验失败时返回 false
 */
export const jwtExtractSub = async ({ secret, ctx }: { secret: string; ctx: Context }): Promise<false | string> => {
  try {
    const authorization = ctx.req.header('Authorization') || '';
    const token = authorization.replace(/^Bearer /i, '');

    const payload = await jwtVerify({ secret, token });
    return payload.sub;
  } catch (_) {
    return false;
  }
};
