// const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'production',
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/instatrip/',
    filename: 'app.min.js',
  },
  // Useful for analysing bundle, keep commented out otherwise (breaks netlify build)
  // plugins: [
  //   new BundleAnalyzerPlugin()
  // ]
});
