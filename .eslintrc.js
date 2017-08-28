// http://eslint.org/docs/user-guide/configuring
module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
        es6: true,
        amd: true,
    },
    extends: ['eslint:recommended', 'google', 'vue'],
    // required to lint *.vue files
    plugins: [
        'html',
        'vue',
    ],
    'rules': {
        'vue/jsx-uses-vars': 2,

        'max-len': ['error', 140],

        'one-var': 'off',

        'no-console': 'off',

        'indent': ['error', 2],

        'comma-dangle': ['error', 'always-multiline'],

        'space-before-blocks': ['error', 'never'],

        'space-before-function-paren': ['error', 'never'],

        'switch-colon-spacing': 'off',

        'object-curly-spacing': ['error', 'never']
    }
}
