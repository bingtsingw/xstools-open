import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}': 'vp check',
    '**/*.{html,css,scss,less,md,mdx,json,jsonc,json5,yaml,yml,toml,graphql,gql,vue}': 'vp fmt',
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
    plugins: ['typescript', 'unicorn', 'oxc', 'react', 'import'],
    rules: {
      'no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-fallthrough': 'error',
    },
  },
  fmt: {
    ignorePatterns: [
      '**/.DS_Store',
      '**/.eslintcache',
      '**/yarn.lock',
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
      '**/node_modules',
      '**/.husky',
      '**/*.log',
      '**/*.ico',
      '**/*.svg',
      '**/*.png',
      '**/*ignore',
      '**/.editorconfig',
      '**/CHANGELOG.md',
      '**/build',
      '**/coverage',
      '**/dist',
      '**/.next',
      '**/.umi',
      '**/.umi-test',
      '**/.umi-production',
    ],
    printWidth: 120,
    proseWrap: 'never',
    singleQuote: true,
  },
});
