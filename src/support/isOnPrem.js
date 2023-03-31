const { getConfig } = require('../config')

const isOnPrem = () => {
  const { SWAGGERHUB_URL } = getConfig()
  return !SWAGGERHUB_URL.endsWith('swaggerhub.com')
}

module.exports = {
  isOnPrem
}