import { createHash, createHmac } from 'crypto';

const normalizeHeaders = (headers: Record<string, string>) => {
  return Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value.trim()]));
};

const encodeQueryComponent = (value: string): string => {
  return encodeURIComponent(value).replace(/[!'()*]/g, (character) => {
    return `%${character.charCodeAt(0).toString(16).toUpperCase()}`;
  });
};

const getCanonicalQuery = (url: URL): string => {
  return Array.from(url.searchParams.entries())
    .map(([key, value]) => [encodeQueryComponent(key), encodeQueryComponent(value)] as const)
    .sort(([leftKey, leftValue], [rightKey, rightValue]) => {
      if (leftKey === rightKey) {
        return leftValue < rightValue ? -1 : Number(leftValue > rightValue);
      }

      return leftKey < rightKey ? -1 : 1;
    })
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

interface SignV3Result {
  signature: string;
  authorization: string;
  headers: Record<string, string>;
}

export function signV3({
  method,
  url,
  headers,
  body,
  ak,
  sk,
}: {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
  ak: string;
  sk: string;
}): SignV3Result {
  const algorithm = 'ACS3-HMAC-SHA256';
  const u = new URL(url);
  const requestHeaders = normalizeHeaders(headers);

  requestHeaders['host'] ||= u.host;
  requestHeaders['x-acs-date'] ||= new Date().toJSON().replace(/[.]\d+Z$/, 'Z'); // 2000-01-01T00:00:00.000Z
  requestHeaders['x-acs-signature-nonce'] ||= Math.random().toString(36).substring(2, 15);
  requestHeaders['x-acs-content-sha256'] = createHash('sha256')
    .update(body || '')
    .digest('hex');

  const normalizedHeaders = Object.entries(requestHeaders)
    .filter(([key]) => key.startsWith('x-acs-') || key === 'host' || key === 'content-type')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => [key, value]);
  const signedHeaders = normalizedHeaders.map(([k]) => k).join(';');
  const parts = [
    method.toUpperCase(),
    u.pathname,
    getCanonicalQuery(u),
    normalizedHeaders.map(([k, v]) => `${k}:${v}\n`).join(''),
    signedHeaders,
    requestHeaders['x-acs-content-sha256'],
  ];
  const hash = createHash('sha256').update(parts.join('\n')).digest('hex');
  const signature = createHmac('sha256', sk).update([algorithm, hash].join('\n')).digest('hex');
  const authorization = `${algorithm} Credential=${ak},SignedHeaders=${signedHeaders},Signature=${signature}`;

  return {
    signature,
    authorization,
    headers: {
      ...requestHeaders,
      authorization,
    },
  };
}
