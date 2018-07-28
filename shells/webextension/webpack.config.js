const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    background: "./src/background.js",
    devtools: "./src/devtools.js",
    panel: "./src/panel.js"
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /(node_modules)/
      },
      // Workaround for .mjs files in graphql-js not working with Webpack 4
      // See: https://github.com/graphql/graphql-js/issues/1272
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      }
    ]
  },
  //  Workaround for https://github.com/graphql/graphql-language-service/issues/128
  plugins: [new webpack.IgnorePlugin(/\.flow$/)]
};
