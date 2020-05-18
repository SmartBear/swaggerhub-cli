const { acceptHeader, authHeader, contentTypeHeader, reqType, userAgentHeader } = require('../utils/http')
const fetch = require('node-fetch')
const config = require('../services/config')
const { mergeDeep } = require('../utils/data-transform')
const { hasJsonStructure } = require('../utils/input-validation')
const qs = require('querystring')

const postApi = obj => {
  const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
  const [owner, name] = obj.pathParams
  const isJson = hasJsonStructure(obj.body)

  return fetch(`${SWAGGERHUB_URL}/apis/${owner}/${name}?${qs.stringify(obj.queryParams)}`, {
    headers: mergeDeep(authHeader(SWAGGERHUB_API_KEY), contentTypeHeader(isJson ? 'json':'yaml')),
    method: 'POST',
    body: obj.body
  })
}

const getApiVersions = obj => {
  const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
  const [owner, name] = obj.pathParams

  return fetch(`${SWAGGERHUB_URL}/apis/${owner}/${name}`, {
    headers: authHeader(SWAGGERHUB_API_KEY)
  })
}

const getApiVersion = (command, identifier, flags) => {

  const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
  const { userAgent, name } = command.config
  return fetch(`${SWAGGERHUB_URL}/apis/${identifier}`, {
    headers: mergeDeep(
      acceptHeader(reqType(flags)),
      authHeader(SWAGGERHUB_API_KEY),
      userAgentHeader(userAgent, name))
  })
}

module.exports = {
  getApiVersion,
  getApiVersions,
  postApi
}
