const { getSpec } = require('./spec')

const getProject = (pathParams, queryParams, accept = 'json') =>
    getSpec('projects', pathParams, queryParams, accept)

module.exports = {
    getProject
}