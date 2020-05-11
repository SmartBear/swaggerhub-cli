const fs = require('fs-extra')
const path = require('path')

class ConfigData {
  constructor() {
    this.swaggerHubUrl = 'https://app.swaggerhub.com'
    this.apiKey = undefined
  }
}

class Config {
  constructor(configDir) {
    this.configDir = configDir
    this.configFile = path.join(configDir, 'config.json')
    this.configData = new ConfigData()
  }

  load() {
    if (fs.existsSync(this.configFile)) {
      this.configData = fs.readJSONSync(this.configFile)
    }
  }

  save() {
    fs.outputJsonSync(this.configFile, this.configData, { mode: 0o600 })
  }

  get swaggerHubUrl() {
    return this.configData.swaggerHubUrl
  }

  set swaggerHubUrl(url) {
    this.configData.swaggerHubUrl = url
  }

  get apiKey() {
    return process.env.SWAGGERHUB_API_KEY || this.configData.apiKey
  }

  set apiKey(apiKey) {
    this.configData.apiKey = apiKey
  }
}

module.exports = Config
