const config = require('../config')
const http = require('../support/http')

const putDomain = ({ pathParams, body }) => {
  const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()

  return http({
    url: [SWAGGERHUB_URL, 'domains', ...pathParams],
    auth: SWAGGERHUB_API_KEY,
    userAgent: global.shUserAgent,
    contentType: 'json',
    method: 'PUT',
    body
  })
}

module.exports = {
  putDomain
}
