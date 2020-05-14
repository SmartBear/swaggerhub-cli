
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