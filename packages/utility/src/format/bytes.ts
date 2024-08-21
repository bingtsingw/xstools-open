/**
 * Format bytes to human readable string.
 *
 * @example
 * formatBytes(1024) // => '1 KB'
 * formatBytes(2048) // => '2 KB'
 * formatBytes(2560) // => '2.5 KB'
 * formatBytes(2560000)) // => '2.44 MB'
 *
 * formatBytes(1111) // => '1.08 KB'
 * formatBytes(1111, 1) // => '1.1 KB'
 * formatBytes(1111, 2) // => '1.08 KB'
 * formatBytes(1111, 3) // => '1.085 KB'
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
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
