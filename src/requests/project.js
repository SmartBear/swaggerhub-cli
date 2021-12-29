const { getSpec, postSpec } = require('./spec')

const getProject = (pathParams, queryParams, accept = 'json') =>
    getSpec('projects', pathParams, queryParams, accept)

const postProject = ({ pathParams, queryParams, body }) =>
    postSpec('projects', pathParams, queryParams, body)

module.exports = {
    getProject,
    postProject
}