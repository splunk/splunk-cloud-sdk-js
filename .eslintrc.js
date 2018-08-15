module.exports = {
    extends: ['eslint-config-airbnb-base','prettier'],
    globals: {
        __DEV__: true,
    },
    env: {
        "browser": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    rules: {
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',

        indent: ['error', 4, { SwitchCase: 1, VariableDeclarator: 1, outerIIFEBody: 1 }],
        // disabled until this issue is fixed:
        //  https://github.com/eslint/eslint/issues/5150#issuecomment-317525339
        'no-return-assign': 'off',
        // This should not be turned on for Node.js: https://eslint.org/docs/rules/no-console#when-not-to-use-it
        'no-console': 'off',
        // eslint-config-prettier disables a few valuable rules by default to be compatible with
        // common presets and/or because they only work with certain options when used with prettier
        curly: ['error', 'all'],
        'no-tabs': 'error',
    },
};