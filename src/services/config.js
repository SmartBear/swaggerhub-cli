const { updateJSONSync, readJSONSync } = require('../support/fs')

const checkUrlOverride = config => {
  if (process.env.SWAGGERHUB_URL) {
    return {
      ...config,
      swaggerHubUrl: process.env.SWAGGERHUB_URL
    }
  }
  return config
}

const checkApiKeyOverride = config => {
  if (process.env.SWAGGERHUB_API_KEY) {
    return {
      ...config,
      apiKey: process.env.SWAGGERHUB_API_KEY
    }
  }
  return config
}

const config = {

  getConfig: function() {
    const { configFilePath } = global
    return checkUrlOverride(
      checkApiKeyOverride(
        readJSONSync(configFilePath)))
  },

  setConfig: function(update) {
    const { configFilePath } = global
    return updateJSONSync(configFilePath, update)
  }
}

module.exports = config
