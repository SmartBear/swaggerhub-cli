const { readJSONSync, writeJSONSync } = require('fs-extra')
const { mergeDeep } = require('../utils/general')
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


const isURLValid = () => {
  const { SWAGGERHUB_URL } = getConfig()
  return SWAGGERHUB_URL.endsWith('api.swaggerhub.com') || (!SWAGGERHUB_URL.includes('api.swaggerhub.com') && SWAGGERHUB_URL.endsWith('/v1'))
}

module.exports = {
  setConfig,
  getConfig,
  isURLValid
}
