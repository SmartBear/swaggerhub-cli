import { wrapTemplates } from '../../utils/general.js'

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

export default wrapTemplates({
  swaggerHubUrl,
  apiKey
})
