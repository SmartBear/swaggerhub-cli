const { auth } = require('../utils/http')
const fetch = require('node-fetch')
const { getConfig } = require('../services/config')
const { mergeDeep } = require('../utils/data-transform')
const qs = require('querystring')

const postApi = obj => {
  const swaggerHubUrl = getConfig().swaggerHubUrl
  const apiKey = getConfig().apiKey
  const [owner, name] = obj.pathParams

  return fetch(`${swaggerHubUrl}/apis/${owner}/${name}?${qs.stringify(obj.queryParams)}`, {
    headers: mergeDeep(auth(apiKey), {'Content-Type': 'application/yaml'}),
    method: 'POST',
    body: obj.body
  })
}

const getApiVersions = obj => {
  const swaggerHubUrl = getConfig().swaggerHubUrl
  const apiKey = getConfig().apiKey
  const [owner, name] = obj.pathParams

  return fetch(`${swaggerHubUrl}/apis/${owner}/${name}`, {
    headers: auth(apiKey),
  })
}

module.exports = {
  getApiVersions,
  postApi
}