const path = require('path')

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname,'./src/assets/css/variables.less')
      ]
    }
  },
  devServer:{

    client: {
      webSocketURL: 'ws://127.0.0.1:8080/ws'
    },
    open: true,
    proxy: {
      '/api':{
        target: 'http://localhost:9090',
        changeOrigin: true,
        secure:false,
        ws: true,
        pathRewrite:{"^/api":""}
      }
    }
  },
})
