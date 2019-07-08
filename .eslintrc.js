const OFF = 0;
const ERROR = 2;

module.exports = {
    root: true,
    extends: ['airbnb'],
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 10,
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    env: {
        browser: true,
        node: true,
    },
    rules: {
        'semi': OFF,
        'import/prefer-default-export': 'off',
        'no-param-reassign': 'off',
        'no-unused-expressions': ERROR,
        'no-unused-vars': [ERROR, { args: 'none' }],
        'no-use-before-define': [ERROR, { functions: false, variables: false }],
        'no-useless-concat': OFF,
        'no-var': ERROR,

        'jsx-quotes': [ERROR, 'prefer-double'],
        'space-before-blocks': ERROR,
        'space-before-function-paren': OFF,
        'quotes': [ERROR, 'single', { avoidEscape: true, allowTemplateLiterals: true }],

        'react/jsx-indent': [ERROR, 2],
        'react/jsx-filename-extension': [OFF, {
            extensions: ['.js', '.jsx'],
        }]
    },
}
