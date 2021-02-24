const { getSpec, putSpec, postSpec } = require('./spec')

const getApi = (pathParams, queryParams, accept = 'json') =>
  getSpec('apis', pathParams, queryParams, accept)

const putApi = ({ pathParams, body }) =>
  putSpec('apis', pathParams, body)

const postApi = ({ pathParams, queryParams, body }) =>
  postSpec('apis', pathParams, queryParams, body)

module.exports = {
  getApi,
  putApi,
  postApi
}
