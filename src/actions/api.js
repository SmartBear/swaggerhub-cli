const config = require('../config')
const { reqType } = require('../support/command/parse-input')
const { hasJsonStructure } = require('../utils/general')
const http = require('../support/http')

const getApi = (pathParams, json = true) => {
  const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()

  return http({
    url: [SWAGGERHUB_URL, 'apis', ...pathParams],
    auth: SWAGGERHUB_API_KEY,
    accept: reqType(json),
    userAgent: global.shUserAgent
  })
}

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
    contentType: isJson ? 'json' : 'yaml',
    method: 'POST',
    query: queryParams,
    body
  })
}

const headApi = pathParams => {
  const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()

  return http({
    url: [SWAGGERHUB_URL, 'apis', ...pathParams],
    auth: SWAGGERHUB_API_KEY,
    method: 'HEAD',
    userAgent: global.shUserAgent
  })
}

module.exports = {
  getApi,
  putApi,
  postApi,
  headApi
}
