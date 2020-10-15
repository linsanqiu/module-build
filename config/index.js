const path = require('path')

module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/tm/': {
        target: 'http://10.106.0.93:8081',// 测试环境 new
        // target: 'http://lvqq.vaiwan.com/',// 测试环境 new
        changeOrigin: true,
        pathRewrite: {
          '^/tm/': '/tm/'
        }
      },
      '/datasync/':{
        target: 'http://10.1.4.6:9093',
        changeOrigin: true,
        pathRewrite: {
          '^/datasync/': '/datasync/'
        }
      },
      '/pdf/': {
        target: 'http://10.106.0.93',// 测试环境 new
        changeOrigin: true,
        pathRewrite: {
          '^/pdf/': '/pdf/'
        }
      },
      '/viewer.html': {
        target: 'http://10.106.0.93/viewer.html',// 测试环境 new
        changeOrigin: true,
        pathRewrite: {
          '^/viewer.html': ''
        }
      },
      '/pdf.': {
        target: 'http://10.106.0.93',// 测试环境 new
        changeOrigin: true,
        pathRewrite: {
          '^/pdf.': '/pdf.'
        }
      },
      '/images/': {
        target: 'http://10.106.0.93',// 测试环境 new
        changeOrigin: true,
        pathRewrite: {
          '^/images/': '/images/'
        }
      },
      '/build/': {
        target: 'http://10.106.0.93',// 测试环境 new
        changeOrigin: true,
        pathRewrite: {
          '^/build/': '/build/'
        }
      },
      '/web/cmaps/': {
        target: 'http://10.106.0.93',// 测试环境 new
        changeOrigin: true,
        pathRewrite: {
          '^/web/cmaps/': '/web/cmaps/'
        }
      },
      '/pic/audit':{
        target: 'http://10.106.0.93',// 测试环境 new
        changeOrigin: true,
        pathRewrite: {
          '^/pic/audit': '/pic/audit'
        }
      },
      '/resource/pdf/':{
        target: 'http://10.106.0.171:9988',// 测试环境 new
        changeOrigin: true,
        pathRewrite: {
          '^/resource/pdf/': '/api/file/download/'
        }
      },
      '/tagid/':{
        target: 'http://10.106.0.156:8001',// 测试环境 new
        changeOrigin: true,
        pathRewrite: {
          '^/tagid/': '/tagid-server/'
        }
      },
      '/iframe/tbm/main':{
        target: 'http://10.106.0.93',// 报表url转发
        changeOrigin: true,
        pathRewrite: {
          '^/iframe/tbm/main': '/iframe/tbm/main'
        }
      },
      '/iframe/tbm/fast':{
        target: 'http://10.106.0.93',// 报表url转发
        changeOrigin: true,
        pathRewrite: {
          '^/iframe/tbm/fast': '/iframe/tbm/fast'
        }
      },
      '/iframe/tbm/special':{
        target: 'http://10.106.0.93',// 报表url转发
        changeOrigin: true,
        pathRewrite: {
          '^/iframe/tbm/special': '/iframe/tbm/special'
        }
      },
      '/iframe/tbm/event':{
        target: 'http://10.106.0.93',// 报表url转发
        changeOrigin: true,
        pathRewrite: {
          '^/iframe/tbm/event': '/iframe/tbm/event'
        }
      },
      '/FineReport/decision/':{
        target: 'http://10.106.0.93',// 报表url转发
        changeOrigin: true,
        pathRewrite: {
          '^/FineReport/decision/': '/FineReport/decision/'
        }
      }
    },
    host: 'localhost',
    port: 8091, // if port is in use, a free one will be determined
    autoOpenBrowser: true,
    notifyOnErrors: true,
    useEslint: false,
    showEslintErrorsInOverlay: false,
    devtool: 'cheap-module-eval-source-map'
  },
  directory: {
    root: path.resolve(__dirname, '../'),
    src: path.resolve(__dirname, '../', 'src')
  },
  build: {
    version: '1.0.1',
    dllNum: 3,

    index: path.resolve(__dirname, '../dist/index.html'),

    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    spDirectory: '',
    productionSourceMap: false,
    devtool: '#source-map',

    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    bundleAnalyzerReport: false,

    manifest: true
  }
}
