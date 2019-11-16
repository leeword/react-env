const presets = [
  [
    '@babel/env',
    {
      modules: false,
      useBuiltIns: 'usage',
      corejs: 2,
      loose: true,
    },
  ],
  '@babel/react',
];

const plugins = [
  'lodash',
  '@babel/syntax-dynamic-import',
  '@babel/plugin-proposal-optional-chaining',
  [
    '@babel/plugin-proposal-decorators',
    {
      decoratorsBeforeExport: true,
    },
  ],
  [
    '@babel/proposal-class-properties',
    {
      loose: true,
    },
  ],
  [
    // remove react propTypes in production mode
    'transform-react-remove-prop-types',
    {
      mode: 'wrap',
      ignoreFilenames: ['node_modules'],
    },
  ],
];

// enable hot-loader in development
// and disabled it for less transform code when we build bundle in production mode
if (process.env.NODE_ENV === 'development') {
  plugins.unshift('react-hot-loader/babel')
}

module.exports = {
  presets,
  plugins,
};
