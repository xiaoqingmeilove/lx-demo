'use strict'
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const defaultSettings = require('./src/settings.js')
const $build = require('build-version-util')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const HOST_MAP = {
  dev: 'http://192.168.3.145:8096/api', // http://192.168.3.136:8096
  ex: 'http://lannew.shlanx.cn:8096/api', // http://192.168.3.136:8096
  mh: 'http://192.168.250.11:8096/api'        // http://192.168.250.11:8096/api
}
const ENV_HOST = process.env.ENV_HOST

const HOST = HOST_MAP[ENV_HOST] || HOST_MAP.dev
const name = process.env.VUE_APP_TITLE || defaultSettings.title || 'App'
const port = process.env.port || 36655

const json = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
let version = json.version || '0.0.0'

if (process.env.NODE_ENV === 'production') {
  $build.updateVersion(true, null, (nextVersion) => {
    version = nextVersion
  })
}

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: HOST,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        },
      },
      '/apis': {
        target: `http://192.168.3.118:8096`,
        changeOrigin: true,
        pathRewrite: {
          '^/apis': ''
        },
      },
      '/minio': {
        target: `http://192.168.3.145:8096`,

        changeOrigin: true,
        pathRewrite: {
          '^/minio': '/minio'
        },
      },
      '/sysapi': {
        target: `http://192.168.3.145:8096`,
        changeOrigin: true,
        pathRewrite: {
          '^/sysapi': '/'
        },
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          _VERSION_: JSON.stringify(version)
        }
      })
    ],
  },
  chainWebpack(config) {
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    config.plugins.delete('prefetch')

    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI',
                  priority: 20,
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'),
                  minChunks: 3,
                  priority: 5,
                  reuseExistingChunk: true
                },
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )

    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_NAME === 'sun') {
        const matomoCode = fs.readFileSync('matomo/sun.html', 'utf8');
        args[0].matomo = true;
        args[0].matomoCode = matomoCode;
      } else {
        args[0].matomo = false;
      }
      return args;
    });
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          outputStyle: 'expanded'
        }
      }
    }
  },
}
