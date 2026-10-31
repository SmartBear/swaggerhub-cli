import config from '../config/index.js'
import http from '../support/http/index.js'

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

const getSpectralRuleset = pathParams => {
    const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()

    return http({
        url: [SWAGGERHUB_URL, 'standardization', 'spectral-rulesets', pathParams, 'zip'],
        auth: SWAGGERHUB_API_KEY,
        contentType: 'zip',
        method: 'GET'
    })
}

export {
    saveSpectralRuleset,
    getSpectralRuleset
}