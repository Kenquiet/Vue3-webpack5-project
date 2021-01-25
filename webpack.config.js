const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader/dist/index');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development', // 环境
  entry: path.resolve(__dirname, './src/main.js'), // 打包指定路径
  output: {
    path: path.resolve(__dirname, 'dist'), // 打包生成路径
    filename: 'js/[name].js' // 打包生成的静态资源名字
  },
  module: {
    rules: [{
      test: /\.vue$/,
      use: ['vue-loader']
    },{
      test: /\.js$/,
      exclude: /node_modules/, // 不编译node_modules文件
      loader: 'babel-loader'
    },{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      filename: 'index.html',
      title: '简单版 Vue3 开发环境'
    }),
    new VueLoaderPlugin(), // 添加插件进来
    new CleanWebpackPlugin(), // 添加插件进来
  ],
  resolve: {
    extensions: ['.js', '.vue', '.ts', 'json'],
    alias: {
      "@": path.resolve(__dirname, 'src'),
      "/#": path.resolve(__dirname, 'src/assets')
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'), // 处理静态文件内容
    port: 8083,
    host: '127.0.0.1',
    hot: true, // 启用热更新
    compress: false, // 对打包进行压缩，默认为false，记录了以后可能会用到
    publicPath: '/'
  }
}