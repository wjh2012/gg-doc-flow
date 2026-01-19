// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        {
          type: 'app',
          pattern: 'apps/:appName/*',
        },
        {
          type: 'lib',
          pattern: 'libs/:libName/*',
        },
      ],
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // 의존성 규칙
      'boundaries/element-types': [
        2,
        {
          default: 'disallow',
          rules: [
            {
              from: 'app',
              allow: ['lib', ['app', { appName: '${from.appName}' }]],
            },
            {
              from: 'lib',
              allow: ['lib'],
            },
          ],
        },
      ],
    },
  },
);
