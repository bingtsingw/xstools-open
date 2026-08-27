import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    // 1. 指定入口文件
    entry: ['src/index.ts'],

    // 2. 产物格式与后缀配置
    format: ['esm'],
    outExtensions() {
      return {
        js: '.js',
      };
    },

    // 3. 构建选项
    dts: true,
    clean: true,
    sourcemap: true,
    treeshake: true,
  },
});
