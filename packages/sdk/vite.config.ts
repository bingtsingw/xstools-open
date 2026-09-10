import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: [
      'src/index.ts',
      // 'src/alicloud/index.ts',
      // 'src/dingtalk/index.ts',
      // 'src/wechat-miniprogram/index.ts',
      // 'src/wechat-oplatform/index.ts',
      // 'src/wechat-pay/index.ts',
      // 'src/wechat-pay-partner/index.ts',
      // 'src/wechat-supplier/index.ts',
      // 'src/xcloud/index.ts',
      // 'src/yzh/index.ts',
    ],

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
