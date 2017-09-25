module.exports = {
  parser: 'babel-eslint',
  plugins: ['html', 'vue'],
  env: {
    'browser': true,
    'es6': true,
    'amd': true,
  },
  extends: ['eslint:recommended', 'google', 'vue'],
  'parserOptions': {
    'sourceType': 'module',
  },
  'rules': {
    'vue/jsx-uses-vars': 2,
    'max-len': ['error', 140],
    'one-var': 'off',
    'no-console': 'off',
    indent: ['error', 2],
    'linebreak-style': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    camelcase: 'off',
    'space-before-function-paren': ['error', 'never'],
    'object-curly-spacing': ['error', 'never'],
    'keyword-spacing': ['error', {
      before: false,
      after: false,
      overrides: {
        'const' : {
          before: true,
          after: true,
        },
        from: {
          before: true,
          after: true,
        },
        'import': {
          before: true,
          after: true,
        },
        as: {
          before: true,
          after: true,
        },
        'return': {
          before: true,
          after: true,
        }
      }
    }],
    'space-before-blocks': ['error', 'never'],
  }
};
