const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".json"]
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx|js|jsx)$/,
        include: [path.resolve(__dirname, "src")],
        loader: "babel-loader"
      }
    ]
  },
  devServer: {
    open: true
  }
};
