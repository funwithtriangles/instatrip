const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  watch: true,
  devtool: 'inline-source-map',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: 'test-video' }],
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 8080,
    // inline: false, // Uncomment when testing iOS
    https: {
      key: fs.readFileSync('./certs/key.pem'),
      cert: fs.readFileSync('./certs/cert.pem'),
    },
    host: '0.0.0.0',
  },
});
