module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
  },
  extends: ['eslint-config-custom'],
  rules: {
    'no-console': 'off',
    'prefer-regex-literals': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        '': 'never',
      },
    ],
  },
}
