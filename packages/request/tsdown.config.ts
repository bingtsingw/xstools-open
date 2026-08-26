import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  outExtensions() {
    return {
      js: '.js',
    };
  },
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
});
