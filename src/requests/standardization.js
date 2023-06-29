const config = require('../config')
const http = require('../support/http')
const { hasJsonStructure } = require('../utils/general')

const postStandardization = (pathParams, body) => {
    const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()
    const isJson = hasJsonStructure(body)

    return http({
        url: [SWAGGERHUB_URL, 'standardization', ...pathParams],
        auth: SWAGGERHUB_API_KEY,
        contentType: isJson ? 'json' : 'yaml',
        method: 'POST',
        body
    })
}

module.exports = {
    postStandardization
}