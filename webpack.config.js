const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/main/index.tsx",
  output: {
    path: path.join(__dirname, "public/js"),
    publicPath: "/public/js",
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  devServer: {
    static: "./public",
    devMiddleware: {
      writeToDisk: true,
    },
    historyApiFallback: true,
  },
  externals: {
    react: "React",
    "react-dom": "ReactDom",
  },
  plugins: [new CleanWebpackPlugin()],
};
