const { wrapTemplates } = require('../../utils/general')

const swaggerHubUrl = {
  name: 'SWAGGERHUB_URL',
  message: 'SwaggerHub URL:',
  default: '{{SWAGGERHUB_URL}}'
}

const apiKey = {
  name: 'SWAGGERHUB_API_KEY',
  message: 'API Key:',
  default: '{{SWAGGERHUB_API_KEY}}'
}

module.exports = wrapTemplates({
  swaggerHubUrl,
  apiKey
})
