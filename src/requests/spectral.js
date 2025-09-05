const config = require('../config')
const http = require('../support/http')

const saveSpectralRuleset = (pathParams, body) => {
    const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()

    return http({
        url: [SWAGGERHUB_URL, 'standardization', 'spectral-rulesets', pathParams, 'zip'],
        auth: SWAGGERHUB_API_KEY,
        contentType: 'zip',
        method: 'PUT',
        body
    })
}

const getSpectralRuleset = (pathParams) => {
    const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()

    return http({
        url: [SWAGGERHUB_URL, 'standardization', 'spectral-rulesets', pathParams, 'zip'],
        auth: SWAGGERHUB_API_KEY,
        contentType: 'zip',
        method: 'GET'
    })
}

module.exports = {
    saveSpectralRuleset,
    getSpectralRuleset
}