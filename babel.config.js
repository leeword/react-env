const presets = [
    [
      '@babel/env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: '3.0.0',
      },
    ],
    '@babel/react'
];

const plugins = [
    'lodash',
    '@babel/syntax-dynamic-import',
    '@babel/proposal-class-properties',
    [
      // 生产环境打包移除 propTypes
      'transform-react-remove-prop-types',
        {
          'mode': 'wrap',
          'ignoreFilenames': ['node_modules']
        },
    ],
];

if (process.env.HOT_RELOAD == 1) {
  plugins.unshift('react-hot-loader/babel')
}

module.exports = {
    presets,
    plugins,
};
