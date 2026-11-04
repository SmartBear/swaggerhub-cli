const config = require('../config')

const isOnPrem = () => {
  const { SWAGGERHUB_URL } = config.getConfig()
  return !SWAGGERHUB_URL.endsWith('swaggerhub.com')
}

module.exports = {
  isOnPrem
}