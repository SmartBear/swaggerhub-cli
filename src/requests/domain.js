const { getSpec, putSpec, postSpec } = require('./spec')

const getDomain = (pathParams, queryParams, accept = 'json') =>
  getSpec('domains', pathParams, queryParams, accept)

const putDomain = ({ pathParams, body }) =>
  putSpec('domains', pathParams, body)

const postDomain = ({ pathParams, queryParams, body }) =>
  postSpec('domains', pathParams, queryParams, body)

module.exports = {
  getDomain,
  putDomain,
  postDomain
}
