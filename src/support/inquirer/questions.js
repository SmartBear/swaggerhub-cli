const swaggerHubUrl = ({ swaggerHubUrl }) => ({
  name: 'swaggerHubUrl',
  message: 'SwaggerHub URL:',
  default: swaggerHubUrl
})

const apiKey = ({ apiKey }) => ({
  type: 'input',
  name: 'apiKey',
  message: 'API Key',
  default: apiKey || null
})

module.exports = {
  swaggerHubUrl,
  apiKey
}
