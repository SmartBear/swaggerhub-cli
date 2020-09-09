const config = require('../config')
const { hasJsonStructure } = require('../utils/general')
const http = require('../support/http')
const { getSpec, putSpec } = require('./spec')

const getApi = (pathParams, queryParams, accept = 'json') => {
  return getSpec('apis', pathParams, queryParams, accept)
}

const putApi = ({ pathParams, body }) => {
  return putSpec('apis', pathParams, body)
}

const postApi = ({ pathParams, queryParams, body }) => {
  const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
  const [owner, name] = pathParams
  const isJson = hasJsonStructure(body)

  return http({
    url: [SWAGGERHUB_URL, 'apis', owner, name],
    auth: SWAGGERHUB_API_KEY,
    contentType: isJson ? 'json' : 'yaml',
    method: 'POST',
    query: queryParams,
    body
  })
}

module.exports = {
  getApi,
  putApi,
  postApi
}
