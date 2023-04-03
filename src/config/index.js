const fse = require('fs-extra') // We're not using {readSyncJSON, ...} expansion, since we want to mock it.
const { mergeDeep, pick } = require('../utils/general')

const swaggerhubUrlRegex = new RegExp(/^https?:\/\/api\..*swaggerhub\.com$/)
const environmentalKeys = ['SWAGGERHUB_URL', 'SWAGGERHUB_API_KEY']

const checkEnvOverrides = config => ({
  ...config,
  ...pick(process.env, environmentalKeys)
})

const getConfig = () => {
  const { configFilePath } = global
  return checkEnvOverrides(fse.readJSONSync(configFilePath))
}

const setConfig = update => {
  const { configFilePath } = global
  return fse.writeJSONSync(configFilePath, mergeDeep(fse.readJSONSync(configFilePath), update))
}

const isURLValid = () => {
  const { SWAGGERHUB_URL } = getConfig()
  return swaggerhubUrlRegex.test(SWAGGERHUB_URL) ||
   (!SWAGGERHUB_URL.includes('api.swaggerhub.com') && SWAGGERHUB_URL.endsWith('/v1')) ||
   SWAGGERHUB_URL.includes('localhost')
}

module.exports = {
  setConfig,
  getConfig,
  isURLValid
}
