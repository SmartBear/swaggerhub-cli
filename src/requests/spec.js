import config from '../config/index.js'
import http from '../support/http/index.js'
import { hasJsonStructure } from '../utils/general.js'

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

const putSpec = (specType, pathParams, body, query) => {
  const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
  return http({
    url: [SWAGGERHUB_URL, specType, ...pathParams],
    auth: SWAGGERHUB_API_KEY,
    contentType: 'json',
    method: 'PUT',
    query,
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

export {
    getSpec,
    deleteSpec,
    putSpec,
    postSpec
}