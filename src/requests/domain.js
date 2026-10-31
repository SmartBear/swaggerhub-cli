import { getSpec, postSpec, deleteSpec } from './spec.js'

const getDomain = (pathParams, queryParams, accept = 'json') =>
  getSpec('domains', pathParams, queryParams, accept)

const deleteDomain = (pathParams, queryParams) =>
  deleteSpec('domains', pathParams, queryParams)

const postDomain = ({ pathParams, queryParams, body }) =>
  postSpec('domains', pathParams, queryParams, body)

export {
  getDomain,
  deleteDomain,
  postDomain
}