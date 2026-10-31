import { getSpec, putSpec, postSpec, deleteSpec } from './spec.js'

const getApi = (pathParams, queryParams, accept = 'json') =>
  getSpec('apis', pathParams, queryParams, accept)

const deleteApi = pathParams =>
  deleteSpec('apis', pathParams)

const putApi = ({ pathParams, body }) =>
  putSpec('apis', pathParams, body)

const postApi = ({ pathParams, queryParams, body }) =>
  postSpec('apis', pathParams, queryParams, body)

export {
  getApi,
  deleteApi,
  putApi,
  postApi
}