export const oid = (): string => {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, '');
  const time = now.getMilliseconds().toString() + now.getTime().toString();
  const timeRand = (parseInt(time, 10) / 42).toString(10).slice(0, 8);

  return date + timeRand + Math.random().toString().slice(2, 8);
};
