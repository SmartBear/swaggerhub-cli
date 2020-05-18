const { authHeader, contentTypeHeader } = require('../utils/http')
const fetch = require('node-fetch')
const config = require('../services/config')
const { mergeDeep } = require('../utils/data-transform')
const { hasJsonStructure } = require('../utils/input-validation')
const qs = require('querystring')

const postApi = obj => {
  const { swaggerHubUrl, apiKey } = config.getConfig()
  const [owner, name] = obj.pathParams
  const isJson = hasJsonStructure(obj.body)

  return fetch(`${swaggerHubUrl}/apis/${owner}/${name}?${qs.stringify(obj.queryParams)}`, {
    headers: mergeDeep(authHeader(apiKey), contentTypeHeader(isJson ? 'json':'yaml')),
    method: 'POST',
    body: obj.body
  })
}

const getApiVersions = obj => {
  const { swaggerHubUrl, apiKey } = config.getConfig()
  const [owner, name] = obj.pathParams

  return fetch(`${swaggerHubUrl}/apis/${owner}/${name}`, {
    headers: authHeader(apiKey)
  })
}

module.exports = {
  getApiVersions,
  postApi
}