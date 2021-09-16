const config = require('../config')
const http = require('../support/http')
const { hasJsonStructure } = require('../utils/general')

const getSpec = (specType, pathParams, queryParams, accept) => {
    const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
    return http({
      url: [SWAGGERHUB_URL, specType, ...pathParams],
      auth: SWAGGERHUB_API_KEY,
      accept: accept,
      query: queryParams
    })
  }

  const deleteSpec = (specType, pathParams, queryParams) => {
    const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
    return http({
      url: [SWAGGERHUB_URL, specType, ...pathParams],
      auth: SWAGGERHUB_API_KEY,
      contentType: 'json',
      method: 'DELETE',
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

const postSpec = (specType, pathParams, queryParams, body) => {
  const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
  const isJson = hasJsonStructure(body)

  return http({
    url: [SWAGGERHUB_URL, specType, ...pathParams],
    auth: SWAGGERHUB_API_KEY,
    contentType: isJson ? 'json' : 'yaml',
    method: 'POST',
    query: queryParams,
    body
  })
}

module.exports = {
    getSpec,
    deleteSpec,
    putSpec,
    postSpec
}
