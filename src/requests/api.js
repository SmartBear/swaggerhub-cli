const { getSpec, putSpec, postSpec, deleteSpec } = require('./spec')

const getApi = (pathParams, queryParams, accept = 'json') =>
  getSpec('apis', pathParams, queryParams, accept)

const deleteApi = pathParams =>
deleteSpec('apis', pathParams)

const putApi = ({ pathParams, body }) =>
  putSpec('apis', pathParams, body)

const postApi = ({ pathParams, queryParams, body }) =>
  postSpec('apis', pathParams, queryParams, body)

module.exports = {
  getApi,
  deleteApi,
  putApi,
  postApi
}
