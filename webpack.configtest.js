module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    fallback: {
      crypto: false,
      path: false,
      fs: false
    }
  },
  output: {
    filename: "absurd-fts-sql.js",
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
