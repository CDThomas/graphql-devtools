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
      }
    ]
  }
};
