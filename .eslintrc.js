const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
    env: {
        jest: true,
        browser: true,
        node: true,
        es6: true
    },
    extends: ['prettier-standard'],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
    },
    rules: {
        'prettier/prettier': ['error', prettierOptions],
        'arrow-body-style': [2, 'as-needed'],
        "quotes": [2, "double"],
        'class-methods-use-this': 0,
        'import/imports-first': 0,
        'import/newline-after-import': 0,
        'import/no-dynamic-require': 0,
        'import/no-extraneous-dependencies': 0,
        'import/no-named-as-default': 0,
        'import/no-unresolved': 0,
        'import/prefer-default-export': 0,
        'no-param-reassign': 0,
        'max-len': 0,
        'newline-per-chained-call': 0,
        'no-confusing-arrow': 0,
        'no-console': 1,
        'no-unused-vars': 2,
        'no-use-before-define': 0,
        'prefer-template': 2,
        'require-yield': 0
    }
};