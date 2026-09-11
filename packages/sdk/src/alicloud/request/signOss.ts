import { createHash, createHmac } from 'crypto';
import type { Alicloud } from '../types';
import { getOssCanonicalUri } from './object';

const _h = (key: string | Buffer, data: string): Buffer => {
  return createHmac('sha256', key).update(data).digest();
};

const getStandardRegion = (region: string) => {
  return region.replace(/^oss-/g, '');
};

type OssHeaders = Record<string, string>;

const normalizeHeaders = (headers: OssHeaders = {}): OssHeaders => {
  return Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value.trim()]));
};

const isRequiredCanonicalHeader = (name: string): boolean => {
  return name === 'content-type' || name === 'content-md5' || name.startsWith('x-oss-');
};

const isAdditionalCanonicalHeader = (name: string): boolean => {
  return !isRequiredCanonicalHeader(name) && !['authorization', 'date', 'host'].includes(name);
};

export const signOss = ({
  config,
  method,
  headers,
  object,
}: {
  config: Alicloud.Oss.ClientConfig;
  method: string;
  headers?: OssHeaders;
  object: string;
}): OssHeaders => {
  const { accessKeyId, accessKeySecret, host, bucket } = config;
  const region = getStandardRegion(config.region);
  const date = new Date();
  const defaultDate = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const normalizedHeaders = normalizeHeaders(headers);

  const requestHeaders: OssHeaders = {
    ...normalizedHeaders,
    host,
    date: date.toUTCString(),
    'x-oss-date': normalizedHeaders['x-oss-date'] || defaultDate,
    'x-oss-content-sha256': 'UNSIGNED-PAYLOAD',
  };
  const dateISO = requestHeaders['x-oss-date'] || defaultDate;
  const dateStr = dateISO.split('T')[0] as string;
  const scope = `${dateStr}/${region}/oss/aliyun_v4_request`;
  const additionalHeaders = Object.keys(requestHeaders).filter(isAdditionalCanonicalHeader).sort();
  const canonicalHeaders = Object.keys(requestHeaders)
    .filter((name) => isRequiredCanonicalHeader(name) || additionalHeaders.includes(name))
    .sort()
    .map((name) => `${name}:${requestHeaders[name]}\n`)
    .join('');

  const signKey = _h(_h(_h(_h('aliyun_v4' + accessKeySecret, dateStr), region), 'oss'), 'aliyun_v4_request');
  const signBody = [
    method.toUpperCase(),
    getOssCanonicalUri(bucket, object),
    '', // Canonical query string
    canonicalHeaders,
    additionalHeaders.join(';'),
    requestHeaders['x-oss-content-sha256'],
  ].join('\n');

  const signature = _h(
    signKey,
    `OSS4-HMAC-SHA256\n${dateISO}\n${scope}\n${createHash('sha256').update(signBody).digest('hex')}`,
  ).toString('hex');
  const additionalHeadersValue =
    additionalHeaders.length > 0 ? `, AdditionalHeaders=${additionalHeaders.join(';')}` : '';

  return {
    ...requestHeaders,
    Authorization: `OSS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}${additionalHeadersValue}, Signature=${signature}`,
  };
};
