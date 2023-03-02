const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    publicPath: '/',
    hot: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    disableHostCheck: true,
    host: '0.0.0.0',
    port:8083,
  },
  entry: './src/index.js',
  mode: 'development',
  resolve: {
    extensions: ['.dev.js', '.js', '.json', '.wasm'],
    fallback: {
      crypto: false,
      path: false,
      fs: false
    }
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })]
};
