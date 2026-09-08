import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: ['src/miniAbortController.ts', 'src/objectHasOwn.ts'],
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
  },
});
