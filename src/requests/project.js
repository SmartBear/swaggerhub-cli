import { getSpec, postSpec, deleteSpec, putSpec } from './spec.js'

const getProject = (pathParams, queryParams, accept = 'json') =>
    getSpec('projects', pathParams, queryParams, accept)

const postProject = ({ pathParams, queryParams, body }) =>
    postSpec('projects', pathParams, queryParams, body)

const putProject = ({ pathParams, body }) =>
    putSpec('projects', pathParams, body)

const deleteProject = pathParams =>
    deleteSpec('projects', pathParams)

export {
    getProject,
    postProject,
    putProject,
    deleteProject
}