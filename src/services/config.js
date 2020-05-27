const { readJSONSync, writeJSONSync } = require('fs-extra')
const { mergeDeep } = require('../utils/data-transform')
const pick = require('lodash/pick')

const environmentalKeys = ['SWAGGERHUB_URL', 'SWAGGERHUB_API_KEY']

const checkEnvOverrides = config => ({
  ...config,
  ...pick(process.env, environmentalKeys)
})

const getConfig = () => {
  const { configFilePath } = global
  return checkEnvOverrides(readJSONSync(configFilePath))
}

const setConfig = update => {
  const { configFilePath } = global
  return writeJSONSync(configFilePath, mergeDeep(readJSONSync(configFilePath), update))
}

module.exports = {
  setConfig,
  getConfig
}
