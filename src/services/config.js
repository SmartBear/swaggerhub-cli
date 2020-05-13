const { updateJSONSync, readJSONSync } = require('../support/fs')

const getConfig = () => {
  const { configFilePath } = global
  return readJSONSync(configFilePath)
}

const setConfig = update => {
  const { configFilePath } = global
  return updateJSONSync(configFilePath, update)
}

module.exports = {
  setConfig,
  getConfig
}