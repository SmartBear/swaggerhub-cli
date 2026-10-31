import config from '../config/index.js'
import http from '../support/http/index.js'
import { hasJsonStructure } from '../utils/general.js'

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

const getStandardization = (pathParams, queryParams) => {
    const { SWAGGERHUB_URL, SWAGGERHUB_API_KEY } = config.getConfig()

    return http({
        url: [SWAGGERHUB_URL, 'standardization', ...pathParams],
        query: queryParams,
        accept: 'json',
        auth: SWAGGERHUB_API_KEY,
        method: 'GET',
    })
}

export {
    postStandardization,
    getStandardization
}