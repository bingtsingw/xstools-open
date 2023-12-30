export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i > sizes.length - 1) {
    return parseFloat((bytes / Math.pow(k, sizes.length - 1)).toFixed(dm)) + ' ' + sizes[sizes.length - 1];
  }

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
