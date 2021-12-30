const { getSpec, postSpec, deleteSpec } = require('./spec')

const getProject = (pathParams, queryParams, accept = 'json') =>
    getSpec('projects', pathParams, queryParams, accept)

const postProject = ({ pathParams, queryParams, body }) =>
    postSpec('projects', pathParams, queryParams, body)

const deleteProject = pathParams =>
    deleteSpec('projects', pathParams)

module.exports = {
    getProject,
    postProject,
    deleteProject
}