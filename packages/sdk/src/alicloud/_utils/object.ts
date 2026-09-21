const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

export const getOssObjectKey = (value: string): string => {
  const isUrl = isHttpUrl(value);
  const pathname = isUrl ? new URL(value).pathname : value;

  return (isUrl ? decodeURIComponent(pathname) : pathname).replace(/^\/+/, '');
};

export const encodeOssObjectKey = (object: string): string => {
  return encodeURIComponent(object)
    .replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`)
    .replace(/%2F/g, '/');
};

export const getOssObjectUrl = (host: string, object: string): string => {
  return `https://${host}/${encodeOssObjectKey(object)}`;
};

export const getOssCanonicalUri = (bucket: string, object: string): string => {
  return `/${bucket}/${encodeOssObjectKey(object)}`;
};
