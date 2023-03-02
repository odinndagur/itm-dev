const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    publicPath: '/',
    hot: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
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

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "sql-httpvfs.js",
    library: {
      type: "module" // output a JavaScript module
    },
    module: true, // truly
  },
  experiments: {
    outputModule: true  // yes, we really want one
  },
  optimization: {
    minimize: true
  },
};
