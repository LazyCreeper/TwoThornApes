/*
 * @Author: Copyright(c) 2020 Suwings
 * @Date: 2021-05-08 21:46:34
 * @LastEditTime: 2021-08-30 10:43:11
 * @Description:
 */
// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  // options...
  publicPath: "./",
  pages: {
    index: {
      entry: "src/app/index.js",
      template: "public/index.html",
      filename: "index.html",
      title: "MCSManager Panel"
    }
  },
  devServer: {
    port: 8081,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:23333/"
      }
    }
  },
  productionSourceMap: false
};
