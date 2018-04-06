module.exports = {
    parser: 'babel-eslint',
    extends: 'eslint-config-airbnb-base',
    globals: {
        __DEV__: true,
    },
    env: {
        "browser": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    settings: {
        "import/resolver": {
            "webpack": { "config": "webpack.config.js" }
        }
    },
    rules: {
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
        'import/no-webpack-loader-syntax': 'off',

        indent: ['error', 4, { SwitchCase: 1, VariableDeclarator: 1, outerIIFEBody: 1 }],
        // disabled until this issue is fixed:
        //  https://github.com/eslint/eslint/issues/5150#issuecomment-317525339
        'no-return-assign': 'off',
    },
};