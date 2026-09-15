import js from '@eslint/js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const pluginN = require('eslint-plugin-n')
const pluginChaiFriendly = require('eslint-plugin-chai-friendly')
const pluginImmutable = require('eslint-plugin-immutable')
const pluginMocha = (await import('./node_modules/eslint-plugin-mocha/plugin.js')).default

export default [
  js.configs.recommended,

  pluginN.configs['flat/recommended'],

  pluginChaiFriendly.configs.recommendedFlat,

  pluginMocha.configs.recommended,

  {
    plugins: {
      immutable: pluginImmutable,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
    },
    rules: {
      'semi': [2, 'never'],
      'strict': 0,
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      'object-curly-spacing': [2, 'always'],
      'array-bracket-spacing': [2, 'never'],
      'computed-property-spacing': [2, 'never'],
      'no-unused-vars': 0,
      'no-multi-spaces': 1,
      'no-constant-condition': 1,
      'camelcase': 0,
      'no-use-before-define': [2, 'nofunc'],
      'no-useless-escape': 0,
      'no-unsafe-finally': 0,
      'no-underscore-dangle': 0,
      'no-unused-expressions': 0,
      'comma-dangle': 0,
      'arrow-spacing': 'error',
      'space-in-parens': ['error', 'never'],
      'no-else-return': ['error', { 'allowElseIf': false }],
      'no-useless-return': 'error',
      'rest-spread-spacing': 'error',
      'keyword-spacing': ['error', { 'before': true, 'after': true }],
      'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],
      'prefer-template': 'error',
      'no-var': 'error',
      'prefer-const': ['error', { 'destructuring': 'all', 'ignoreReadBeforeAssign': false }],
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': ['error', 'as-needed'],
      'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
      'max-len': ['error', { 'code': 120, 'ignoreTemplateLiterals': true }],
      'mocha/no-mocha-arrows': 0,
      'mocha/no-setup-in-describe': 0,
    },
  },

  {
    files: ['**/*.test.js'],
    rules: {
      'immutable/no-let': 0,
    },
  },
]
