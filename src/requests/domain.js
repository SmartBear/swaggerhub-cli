const { getSpec, postSpec } = require('./spec')

const getDomain = (pathParams, queryParams, accept = 'json') =>
  getSpec('domains', pathParams, queryParams, accept)

const postDomain = ({ pathParams, queryParams, body }) =>
  postSpec('domains', pathParams, queryParams, body)

module.exports = {
  getDomain,
  postDomain
}
