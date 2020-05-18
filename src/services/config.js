const { updateJSONSync, readJSONSync } = require('../support/fs')
const pick = require('lodash/pick')

const checkEnvOverrides = config => ({
  ...config,
  ...pick(process.env, Object.keys(config))
})

const getConfig = () => {
  const { configFilePath } = global
  return checkEnvOverrides(readJSONSync(configFilePath))
}

const setConfig = update => {
  const { configFilePath } = global
  return updateJSONSync(configFilePath, update)
}

module.exports = {
  setConfig,
  getConfig
}