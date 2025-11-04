import eslint from '@eslint/js';
import { defineConfig } from "eslint/config";
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.ts'],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'max-len': [
        'error',
        {
          code: 80,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'max-lines-per-function': [
        'error',
        {
          max: 50,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      'max-lines-per-function': 'off', // Allow longer test functions
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '*.js', 'coverage/**', 'prisma/seed.ts'],
  },
]);
