const presets = [
  [
    '@babel/env',
    {
      modules: false,
      useBuiltIns: 'usage',
      corejs: '3.0.0',
    },
  ],
  '@babel/react',
];

const plugins = [
  // split lodash
  'lodash',
  '@babel/syntax-dynamic-import',
  '@babel/proposal-class-properties',
  [
    // remove react propTypes in production mode
    'transform-react-remove-prop-types',
    {
      mode: 'wrap',
      ignoreFilenames: ['node_modules']
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
