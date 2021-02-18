// const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'production',
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/instatrip/',
    filename: 'app.min.js',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: 'public' }],
    }),
    // Useful for analysing bundle, keep commented out otherwise (breaks netlify build)
    // new BundleAnalyzerPlugin(),
  ],
});
