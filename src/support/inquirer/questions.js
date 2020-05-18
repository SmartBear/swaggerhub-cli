const swaggerHubUrl = ({ swaggerHubUrl }) => ({
  name: 'SWAGGERHUB_URL',
  message: 'SwaggerHub URL:',
  default: swaggerHubUrl || null
})

const apiKey = ({ SWAGGERHUB_API_KEY }) => ({
  name: 'SWAGGERHUB_API_KEY',
  message: 'API Key',
  default: SWAGGERHUB_API_KEY || null
})

module.exports = {
  swaggerHubUrl,
  apiKey
}
