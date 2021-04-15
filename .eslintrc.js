const OFF = 0;
const ERROR = 2;

module.exports = {
  root: true,
  extends: [
    'airbnb',
    'plugin:prettier/recommended',
  ],
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
    'import/no-unresolved': OFF,
    'import/extensions': [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
    ],
    "prettier/prettier": [
      "error",
      // 针对会被 ESLint 格式化的文件类型，Prettier 会作为 ESLint 的一个规则运行并格式化文件，因此需要添加如下配置
      {
        // 行末分号
        semi: true,
        // 单引号
        singleQuote: true,
        // 缩进
        tabWidth: 2,
        // 使用tab还是空格
        useTabs: false,
        // 行宽
        printWidth: 120,
        // JSX break
        jsxBracketSameLine: false,
        // 指定 html 全局空白
        htmlWhitespaceSensitivity: 'strict',
        // 换行符
        endOfLine: 'lf',
      }
    ]
  },
}
