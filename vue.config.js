// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const smp = new SpeedMeasurePlugin({
//   outputFormat: 'human'
// })
const path = require('path')
const resolve = dir => path.join(__dirname, dir)

// const url = 'http://192.168.1.182:8852' // java
// const url = 'http://192.168.7.51:8080' // java  立雄本地
// const warningWsUrl = 'ws://192.168.1.182:8859' // socket
// const imgUrl = 'http://192.168.1.182:8890' // 静态资源
// const mapUrl = 'http://192.168.1.182:8060' // 地图
// // const pyUrl = 'http://192.168.7.152:33333' // python
// const pyUrl = 'http://192.168.7.152:21223' // python
// // const warningUrl = 'http://192.168.1.182:8852' // 预警
// const warningUrl = 'http://192.168.7.51:8080' // 预警 立雄本地

// const url = 'http://192.168.1.182:21256' // java
// const warningWsUrl = 'ws://192.168.1.182:21256' // socket
// const imgUrl = 'http://192.168.1.182:21256' // 静态资源
// const mapUrl = 'http://192.168.1.182:8060' // 地图
// // const pyUrl = 'http://192.168.7.152:33333' // python
// const pyUrl = 'http://192.168.7.152:21523' // python
// // const warningUrl = 'http://192.168.1.182:8852' // 预警
// const warningUrl = 'http://192.168.1.182:21256' // 预警

/*const url = 'http://192.168.7.51:8080' // java
const warningWsUrl = 'ws://192.168.1.182:21992' // socket
const imgUrl = 'http://192.168.7.51:8080' // 静态资源
const mapUrl = 'http://192.168.1.182:8060' // 地图
// const pyUrl = 'http://192.168.7.152:33333' // python
const pyUrl = 'http://192.168.7.152:21100' // python
// const warningUrl = 'http://192.168.1.182:8852' // 预警
const warningUrl = 'http://192.168.7.51:8080' // 预警*/

const url = 'http://192.168.1.182:21888' // java
const warningWsUrl = 'ws://192.168.1.182:21888' // socket
const imgUrl = 'http://192.168.1.182:21888' // 静态资源
const mapUrl = 'http://192.168.1.182:8060' // 地图
// const pyUrl = 'http://192.168.7.152:33333' // python
const pyUrl = 'http://192.168.7.151:21423' // python
// const warningUrl = 'http://192.168.1.182:8852' // 预警
const warningUrl = 'http://192.168.1.182:21888' // 预警
const isDev = process.env.NODE_ENV === 'development'

console.log('当前环境', process.env.NODE_ENV)

const urlCdns = {
  externals: {
    // Vue: 'Vue',
    Vuex: 'Vuex',
    'vue-router': 'VueRouter',
    AMap: 'AMap', // 高德地图配置
    echarts: 'echarts', // echarts 配置
    CryptoJS: 'CryptoJS',
    // 'element-ui': 'ELEMENT',
    axios: 'axios',
    ol: 'ol',
    allRouterBundle: 'allRouterBundle'
  },
  js: [
    // 'static/js/vue.min.js',
    // 'static/js/element.js',
    'js/vue-router.min.js',
    'js/vuex.min.js',
    'js/ol.js',
    'js/axios.min.js',
    'js/crypto-js.min.js',
    'js/echarts.min.js',
    'js/allRouterBundle.js'
  ],
  css: [
    // 'static/css/element.css',
    'css/ol.css'
  ]
}

if (isDev) {
  // const preUrl = imgUrl + '/static'
  // urlCdns.js = urlCdns.js.map(item => preUrl + '/' + item)
  // urlCdns.css = urlCdns.css.map(item => preUrl + '/' + item)
  // console.log('url', urlCdns)
} else {
  const preUrl = '/static/'
  urlCdns.js = urlCdns.js.map(item => preUrl + item)
  urlCdns.css = urlCdns.css.map(item => preUrl + item)
  console.log('url', urlCdns)
}

module.exports = {
  productionSourceMap: false,
  chainWebpack: config => {
    // const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    // types.forEach(type =>
    //   addStyleResource(config.module.rule('less').oneOf(type))
    // )
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    // 别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
      .set('_com', resolve('src/commons'))
      .set('_off', resolve('src/views/offline'))
      .set('_on', resolve('src/views/online'))
      .set('img', resolve('src/assets/img'))
    if (process.env.NODE_ENV === 'production') {
      config.plugin('html').tap(args => {
        // 生产环境或本地需要cdn时，才注入cdn
        args[0].cdn = urlCdns
        return args
      })
    }
    config.cache(true) // 编辑速度加快
    // const wrappedConfig = smp.wrap(config.toConfig());
    // config.toConfig = () => wrappedConfig;
  },
  configureWebpack: config => {
    config.devtool = isDev ? 'eval-source-map' : 'none'
    if (process.env.NODE_ENV === 'production') {
      config.externals = urlCdns.externals
    }
    config.module.rules.push({
      test: /\.vue$/,
      use: {
        loader: path.resolve(__dirname, './src/utils/inline-pxtorem-loader.js'),
        options: {
          rootValue: 192
        }
      }
    })
    // config.devtool = isDev ? 'eval-cheap-module-source-map' : 'hidden-source-map'
  },
  lintOnSave: isDev, // 是否开启eslint
  publicPath:'/',
  css: {
    extract: false,
    loaderOptions: {
      less: {
        globalVars: {
          'cur-bg': '#283247', // 老的全局变量
          'cur-opacity': 0.95, // 老的全局变量
          'border-color': '#202B3F', // 老的全局变量

          'active-color': '#3D6EFF', // 激活状态下的颜色

          'font-color-1': '#C0D0E7', // 基本字体颜色1
          'font-color-2': '#8799BF', // 基本字体颜色2
          'font-color-3': '#FFFFFF', // 基本字体颜色3
          'font-color-4': '#FF106E', // 基本字体颜色4

          'bg-color-1': '#21283E', // 基础背景色1
          'bg-color-2': '#192035', // 基础背景色2
          'bg-color-3': 'rgba(255, 255, 255, .04)', // 基础背景色3

          'border-color-1': '#515C7C', // 基础边框色1
          'border-color-2': 'rgba(255, 255, 255, .12)', // 基础边框色2

          'z-index-1': 1,
          'z-index-2': 10,
          'z-index-3': 100,
          'z-index-4': 1000,
        }
      }
    }
  },
  devServer: {
    open: true,
    host: '0.0.0.0',
    proxy: {
      '/police/warning': {
        target: warningUrl,
        changeOrigin: true,
        pathRewrite: {
          // '^/police/warning': '/warning'
          '^/police/warning': '/police/warning'
        }
      },
      // '/police/preprocess/stat': {
      //   target: dataCenterUrl,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     // '^/police/warning': '/warning'
      //     // '^/police/preprocess/stat': '/stat'
      //   }
      // },
      '/police': {
        target: url,
        changeOrigin: true
      },
      '/py': {
        target: pyUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/py': ''
        }
      },
      '/geoserver': {
        target: mapUrl,
        changeOrigin: true
      },
      // '/ws': {
      //   target: wsUrl,
      //   changeOrigin: true,
      //   ws: true,
      //   pathRewrite: {
      //     '^/ws': '/police/ws'
      //   }
      // },
      '/warningws': {
        target: warningWsUrl,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/warningws': '/police/warning/ws'
        }
      },
      '/static': {
        target: imgUrl
      },
      '/image': {
        target: imgUrl
      }
    }
  },
}
// function addStyleResource (rule) {
//   rule.use('style-resource').loader('style-resources-loader').options({
//     patterns: [path.resolve(__dirname, './src/assets/css/global.less')]
//   })
// }
