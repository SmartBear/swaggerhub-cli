const { getSpec, postSpec, deleteSpec, putSpec } = require('./spec')

const getProject = (pathParams, queryParams, accept = 'json') =>
    getSpec('projects', pathParams, queryParams, accept)

const postProject = ({ pathParams, queryParams, body }) =>
    postSpec('projects', pathParams, queryParams, body)

const putProject = ({ pathParams, body }) =>
    putSpec('projects', pathParams, body)

const deleteProject = pathParams =>
    deleteSpec('projects', pathParams)

module.exports = {
    getProject,
    postProject,
    putProject,
    deleteProject
}