const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  entry: ["webpack/hot/poll?100", "./src/index.ts"],
  watch: process.env.IS_DEV === 'true',
  target: "node",
  externals: [
    nodeExternals({
      whitelist: ["webpack/hot/poll?100"]
    })
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  mode: process.env.IS_DEV === 'true' ? "development" : "production",
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js"
  }
};
