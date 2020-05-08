class Config {
  getApiKey() {
    return process.env.SWAGGERHUB_API_KEY;
  }
}

module.exports = Config;
