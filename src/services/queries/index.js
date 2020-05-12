const { readJSONSync } = require('../../support/fs')

const getConfig = () => {
  const { configFilePath } = global
  return readJSONSync(configFilePath)
}

module.exports = {
  getConfig
}