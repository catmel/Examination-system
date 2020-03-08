const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/static/' : '/',
  outputDir: '../backEnd/public/static',
  // 基本路径
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      // 生产环境
      config.plugins.push(
        new CompressionWebpackPlugin({
          test: /\.js$|\.css$/,
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    } else {
      // 为开发环境修改配置...
    }
  },
  devServer: {
    port: 9090,
    proxy: {
      '/api': {
        target: 'https://localhost:3000', //设置调用接口域名和端口号别忘了加http
        // target: 'http://172.16.130.152:3000', //调用外部服务器数据库
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/' //这里理解成用‘/api’代替target里面的地址，组件中我们调接口时直接用/api代替
          // 比如我要调用'http://locahost:3000/login'，直接写‘/api/login’即可 代理后地址栏显示/
        }
      }
    }
  },
};
