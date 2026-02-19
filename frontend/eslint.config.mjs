import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'build/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // TypeScript already checks for undefined variables
      'no-undef': 'off',
      // Allow `any` — many Firebase hooks need it intentionally
      '@typescript-eslint/no-explicit-any': 'off',
      // Allow unused catch binding variables (error in catch blocks)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { caughtErrors: 'none', argsIgnorePattern: '^_' }
      ]
    }
  }
]
