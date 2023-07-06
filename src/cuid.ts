// import crypto from 'crypto';
// import os from 'os';

// const blockSize = 4;
// const base = 36;
// const discreteValues = Math.pow(base, blockSize);
// const limit = Math.pow(2, 32) - 1;

// const pad = (num: number | string, size: number) => {
//   const s = '000000000' + num;
//   return s.substring(s.length - size);
// };

// const padSize = 2;
// const hostname = os.hostname();
// const pid = pad(process.pid.toString(36), padSize);
// const hostId = pad(
//   hostname
//     .split('')
//     .reduce((prev, char) => {
//       return Number(prev) + char.charCodeAt(0);
//     }, Number(hostname.length) + 36)
//     .toString(36),
//   padSize,
// );
// const fingerprint = () => {
//   return pid + hostId;
// };

// let c = 0;
// const safeCounter = () => {
//   c = c < discreteValues ? c : 0;
//   c++;
//   return c - 1;
// };

// const randomBlock = () => {
//   const ramdom = Math.abs(crypto.randomBytes(4).readInt32BE() / limit);
//   return pad(((ramdom * discreteValues) << 0).toString(base), blockSize);
// };

// export const HelperCuid = (date: Date) => {
//   // hard-coded allows for sequential access
//   const letter = 'c';

//   // warning: this exposes the exact date and time.
//   const timestamp = date.getTime().toString(base);

//   // Prevent same-machine collisions.
//   const counter = pad(safeCounter().toString(base), blockSize);

//   // reduce different-machine collisions
//   const print = fingerprint();

//   // Grab some more chars from Math.random()
//   const random = randomBlock() + randomBlock();

//   return letter + timestamp + counter + print + random;
// };
