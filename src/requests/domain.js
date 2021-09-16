const { getSpec, postSpec, deleteSpec } = require('./spec')

const getDomain = (pathParams, queryParams, accept = 'json') =>
  getSpec('domains', pathParams, queryParams, accept)

const deleteDomain = (pathParams, queryParams) =>
  deleteSpec('domains', pathParams, queryParams)

const postDomain = ({ pathParams, queryParams, body }) =>
  postSpec('domains', pathParams, queryParams, body)

module.exports = {
  getDomain,
  deleteDomain,
  postDomain
}
