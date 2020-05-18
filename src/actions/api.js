const { authHeader, contentTypeHeader } = require('../utils/http')
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
    headers: mergeDeep(
      authHeader(SWAGGERHUB_API_KEY),
      contentTypeHeader(isJson ? 'json':'yaml'),
      userAgentHeader(userAgent, name)),
    method: 'POST',
    body: obj.body
  })
}

const getApiVersions = obj => {
  const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
  const [owner, name] = obj.pathParams

  return fetch(`${SWAGGERHUB_URL}/apis/${owner}/${name}`, {
    headers: mergeDeep(
      authHeader(SWAGGERHUB_API_KEY),
      userAgentHeader(userAgent, name)
    )
  })
}

module.exports = {
  getApiVersions,
  postApi
}
