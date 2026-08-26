import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '**/*.{js,jsx,ts,tsx,html,css,md,json,prisma}': 'vp fmt --check',
    '**/*.{js,jsx,ts,tsx}': 'vp lint',
  },
  lint: {
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
    },
  },
  fmt: {
    printWidth: 120,
    proseWrap: 'never',
    singleQuote: true,
  },
});
