const config = require('../config')
const http = require('../support/http')

const getSpec = (specType, pathParams, queryParams, accept) => {
    const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
    return http({
      url: [SWAGGERHUB_URL, specType, ...pathParams],
      auth: SWAGGERHUB_API_KEY,
      accept: accept,
      query: queryParams
    })
  }

const putSpec = (specType, pathParams, body) => {
    const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
    return http({
        url: [SWAGGERHUB_URL, specType, ...pathParams],
        auth: SWAGGERHUB_API_KEY,
        contentType: 'json',
        method: 'PUT',
        body
    })
}

module.exports = {
    getSpec,
    putSpec
}
