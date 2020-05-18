
const swaggerHubUrl = ({ SWAGGERHUB_URL }) => ({
  name: 'SWAGGERHUB_URL',
  message: 'SwaggerHub URL:',
  default: SWAGGERHUB_URL
})

const apiKey = ({ SWAGGERHUB_API_KEY }) => ({
  name: 'SWAGGERHUB_API_KEY',
  message: 'API Key',
  default: SWAGGERHUB_API_KEY || null
})

const questions = {
  swaggerHubUrl,
  apiKey
}

const getPrompts = (...prompts) => (
  (options = {}) => prompts.map(p => questions[p](options))
)

module.exports = {
  getPrompts
}