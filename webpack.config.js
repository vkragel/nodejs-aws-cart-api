const TerserPlugin = require('terser-webpack-plugin');

const lazyImports = [
  '@nestjs/websockets/socket-module',
  '@nestjs/microservices/microservices-module',
];

module.exports = (options, webpack) => ({
  ...options,
  externals: [],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
        },
      }),
    ],
  },
  output: {
    ...options.output,
    libraryTarget: 'commonjs2',
  },
  plugins: [
    ...options.plugins,
    new webpack.IgnorePlugin({
      checkResource(resource) {
        return lazyImports.includes(resource);
      },
    }),
  ],
});
