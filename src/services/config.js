const fs = require('fs-extra');
const path = require('path');

class ConfigData {
  constructor() {
    this.swaggerHubUrl = "https://app.swaggerhub.com";
    this.apiKey = undefined;
    this.defaultOrg = undefined;
  }
}

class Config {
  constructor(configDir) {
    this.configDir = configDir;
    this.configFile = path.join(configDir, 'config.json');
    this.configData = new ConfigData();
  }

  async load() {
    if (fs.existsSync(this.configFile)) {
      this.configData = fs.readJSONSync(this.configFile);
    }
  }

  async save() {
    await fs.outputJson(this.configFile, this.configData, { mode: 0o600 });
  }

  get swaggerHubUrl() {
    return this.configData.swaggerHubUrl;
  }

  set swaggerHubUrl(url) {
    this.configData.swaggerHubUrl = url;
  }

  get apiKey() {
    return process.env.SWAGGERHUB_API_KEY || this.configData.apiKey;
  }

  set apiKey(apiKey) {
    this.configData.apiKey = apiKey;
  }

  get defaultOrg() {
    return this.configData.defaultOrg;
  }

  set defaultOrg(defaultOrg) {
    this.configData.defaultOrg = defaultOrg;
  }
}

module.exports = Config;
