const { authHeader, contentTypeHeader } = require('../utils/http')
const fetch = require('node-fetch')
const { getConfig } = require('../services/config')
const { mergeDeep } = require('../utils/data-transform')
const qs = require('querystring')

const postApi = obj => {
  const swaggerHubUrl = getConfig().swaggerHubUrl
  const [owner, name] = obj.pathParams
  const isJson = hasJsonStructure(obj.body)

  return fetch(`${swaggerHubUrl}/apis/${owner}/${name}?${qs.stringify(obj.queryParams)}`, {
    headers: mergeDeep(authHeader(), contentTypeHeader(isJson ? 'json':'yaml')),
    method: 'POST',
    body: obj.body
  })
}

const getApiVersions = obj => {
  const swaggerHubUrl = getConfig().swaggerHubUrl
  const [owner, name] = obj.pathParams

  return fetch(`${swaggerHubUrl}/apis/${owner}/${name}`, {
    headers: authHeader(),
  })
}

function hasJsonStructure(str) {
  try {
      const result = JSON.parse(str)
      const type = Object.prototype.toString.call(result)
      return type === '[object Object]' 
          || type === '[object Array]'
  } catch (err) {
      return false
  }
}

module.exports = {
  getApiVersions,
  postApi
}