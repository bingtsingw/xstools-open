import { defineConfig } from 'tsdown';

export default defineConfig({
  // 1. 指定入口文件
  entry: [
    'src/_exports/cuid2/index.ts',
    'src/_exports/date-fns/index.ts',
    'src/_exports/date-fns/locale/index.ts',
    'src/_exports/nanoid/index.ts',
    'src/_exports/ohash/index.ts',
    'src/array/index.ts',
    'src/business/index.ts',
    'src/date/index.ts',
    'src/error/index.ts',
    'src/format/index.ts',
    'src/object/index.ts',
    'src/predicate/index.ts',
    'src/promise/index.ts',
    'src/string/index.ts',
    'src/util/index.ts',
  ],

  // 2. 产物格式与后缀配置
  format: ['esm'],
  outExtension() {
    return {
      js: '.js',
    };
  },

  // 3. 构建选项
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,

  // 4. 依赖处理, 外部依赖全部打包, 关闭提示
  deps: {
    onlyBundle: false,
  },
});
