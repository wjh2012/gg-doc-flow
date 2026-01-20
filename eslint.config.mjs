// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'node_modules/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: { boundaries },
    settings: {
      'boundaries/include': ['apps/**/*', 'libs/**/*'],
      'boundaries/ignore': ['**/*.spec.ts', '**/*.test.ts'],
      'boundaries/dependency-nodes': ['import', 'dynamic-import'],
      'boundaries/elements': [
        {
          type: 'app',
          pattern: ['apps/*/**'],
          capture: ['appName'],
          mode: 'folder',
        },
        {
          type: 'lib',
          pattern: ['libs/*/**'],
          capture: ['libName'],
          mode: 'folder',
        },
      ],
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
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
              allow: [['app', { appName: '${from.appName}' }], 'lib'],
            },
            {
              from: 'lib',
              allow: ['lib'],
            },
          ],
        },
      ],
      'boundaries/no-private': [
        'error',
        {
          allowUncles: false,
        },
      ],
    },
  },
);
