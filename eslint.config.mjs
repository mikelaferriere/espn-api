import eslintPluginJs from '@eslint/js'
import tseslintPlugin from '@typescript-eslint/eslint-plugin'
import tseslintParser from '@typescript-eslint/parser'
import path from 'path'
import { fileURLToPath } from 'url'

export default [
  {
    ignores: ['build', 'tests', 'docs', 'node_modules', 'examples'],
  },
  {
    files: ['**/*.js'],
    ...eslintPluginJs.configs.recommended,
  },
  {
    files: ['**/*.ts'],
    ...eslintPluginJs.configs.recommended,
    ...tseslintPlugin.configs.recommendedTypeChecked,
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: path.dirname(fileURLToPath(import.meta.url)),
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
  {
    files: ['.prettierrc.js', 'jest.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        require: 'readonly',
      },
    },
  },
]
