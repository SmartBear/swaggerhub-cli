const { getSpec, putSpec } = require('./spec')

const getDomain = (pathParams, queryParams, accept = 'json') => {
  return getSpec('domains', pathParams, queryParams, accept)
}

const putDomain = ({ pathParams, body }) => {
  return putSpec('domains', pathParams, body)
}

module.exports = {
  getDomain,
  putDomain
}
