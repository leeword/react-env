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
    'global-require': OFF,
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'no-unused-expressions': ERROR,
    'no-unused-vars': [ERROR, { args: 'none' }],
    'no-restricted-syntax': OFF,
    'no-use-before-define': [ERROR, { functions: false, variables: false }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        'devDependencies': [
          'build/**',
          'test/**',
        ],
        'optionalDependencies': false,
        'peerDependencies': false,
      }
    ],
    'no-useless-concat': OFF,
    'no-var': ERROR,

    'jsx-quotes': [ERROR, 'prefer-double'],
    'space-before-blocks': ERROR,
    'space-before-function-paren': OFF,
    'quotes': [
      ERROR,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      }
    ],

    'react/jsx-indent': [ERROR, 2],
    'react/jsx-filename-extension': [
      OFF,
      {
        extensions: ['.js', '.jsx'],
      }
    ],
    'import/resolver': {
      webpack: {
        config: require('path').resolve(__dirname, 'build/webpack.dev.js'),
      },
    },
    'import/no-unresolved': OFF,
    'import/extensions': [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
    ],
  },
}
