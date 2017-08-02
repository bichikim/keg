module.exports = {
	parser: "babel-eslint",
    plugins: ['html','vue'],
    env: {
        "browser": true,
        "es6": true,
        "amd": true,
    },
    extends: ["eslint:recommended", "google", "vue"],
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
	    'vue/jsx-uses-vars': 2,
        'max-len': ['error', 140],
        'one-var': 'off',
        'no-console': 'off',
        'indent': ['error', 4],
        'linebreak-style': 'off',
        'comma-dangle': ["error", "always-multiline"],
        'camelcase': 'off',
        'space-before-function-paren': ["error", "never"],
        'object-curly-spacing': ["error", "never"],
        // 'capitalized-comments': ["error", "always"],
    }
};