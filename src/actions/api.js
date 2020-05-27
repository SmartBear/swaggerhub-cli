const config = require('../utils/config')
const { hasJsonStructure, reqType } = require('../utils/input-validation')
const http = require('../support/http')

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

const getApiVersions = obj => {
  const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
  const [owner, name] = obj.pathParams

  return http({
    url: [SWAGGERHUB_URL, 'apis', owner, name],
    auth: SWAGGERHUB_API_KEY,
    userAgent: global.shUserAgent
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
  getApiVersions,
  postApi
}
