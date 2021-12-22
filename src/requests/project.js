const config = require('../config')
const http = require('../support/http')

const getProject = (specType, pathParams, queryParams, accept = 'json') => {
    const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
    return http({
        url: [SWAGGERHUB_URL, specType, ...pathParams],
        auth: SWAGGERHUB_API_KEY,
        accept: accept,
        query: queryParams
    })
}

module.exports = {
    getProject
}