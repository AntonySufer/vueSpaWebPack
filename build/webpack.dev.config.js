var config = require('./webpack.base.config')

config.devtool = 'eval-source-map'

config.devServer = {
  host : '192.168.2.136',
  port :80,
  noInfo: true
}

module.exports = config
