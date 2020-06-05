const config = require('../config')
const { reqType } = require('../support/command/parse-input')
const { hasJsonStructure } = require('../utils/general')
const http = require('../support/http')

const putApi = ({ pathParams, body }) => {
  const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()

  return http({
    url: [SWAGGERHUB_URL, 'apis', ...pathParams],
    auth: SWAGGERHUB_API_KEY,
    userAgent: global.shUserAgent,
    contentType: 'json',
    method: 'PUT',
    body
  })
}

const postApi = ({ pathParams, queryParams, body }) => {
  const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
  const [owner, name] = pathParams
  const isJson = hasJsonStructure(body)
  
  return http({
    url: [SWAGGERHUB_URL, 'apis', owner, name],
    auth: SWAGGERHUB_API_KEY,
    userAgent: global.shUserAgent,
    contentType: isJson ? 'json':'yaml',
    method: 'POST',
    query: queryParams,
    body
  })
}

const getApiVersion = (identifier, flags) => {
  const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()

  return http({
    url: [SWAGGERHUB_URL, 'apis', identifier],
    auth: SWAGGERHUB_API_KEY,
    accept: reqType(flags),
    userAgent: global.shUserAgent
  })
}

module.exports = {
  getApiVersion,
  putApi,
  postApi
}
