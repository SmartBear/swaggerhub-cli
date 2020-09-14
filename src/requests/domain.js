const { getSpec, putSpec } = require('./spec')

const getDomain = (pathParams, queryParams, accept = 'json') =>
  getSpec('domains', pathParams, queryParams, accept)

const putDomain = ({ pathParams, body }) =>
  putSpec('domains', pathParams, body)

module.exports = {
  getDomain,
  putDomain
}
