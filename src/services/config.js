const { updateJSONSync, readJSONSync } = require('../support/fs')
const { pipe } = require('../utils/compositions')

const checkUrlOverride = config => {
  if (process.env.SWAGGERHUB_URL) {
    return {
      ...config,
      SWAGGERHUB_URL: process.env.SWAGGERHUB_URL
    }
  }
  return config
}

const checkApiKeyOverride = config => {
  if (process.env.SWAGGERHUB_API_KEY) {
    return {
      ...config,
      SWAGGERHUB_API_KEY: process.env.SWAGGERHUB_API_KEY
    }
  }
  return config
}

const getConfig = () => {
  const { configFilePath } = global
  return pipe(configFilePath)(readJSONSync, checkUrlOverride, checkApiKeyOverride)
}

const setConfig = update => {
  const { configFilePath } = global
  return updateJSONSync(configFilePath, update)
}

module.exports = {
  setConfig,
  getConfig
}
