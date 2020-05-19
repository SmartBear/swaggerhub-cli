const fetch = require('node-fetch')
const qs = require('querystring')
const headerTemplates = require('./header-templates')

const { pipe } = require('../../utils/compositions')
const pick = require('lodash/pick')
const omit = require('lodash/omit')

const buildHeaders = options => Object.keys(options)
  .reduce((obj, key) => ({
    ...headerTemplates[key](options),
    ...obj
  }), {})

const parseQuery = ({ query, ...rest }) => ({
  query: query ? `?${qs.stringify(query)}` : '',
  ...rest
})

const parseUrl = ({ url, query, ...rest }) => ({
  url: url.join('/').concat(query),
  ...rest
})

const parseHeaders = options => {
  const headerOptions = pick(options, Object.keys(headerTemplates))
  const filteredOptions = omit(options, Object.keys(headerTemplates))
  
  return {
    ...filteredOptions,
    headers: buildHeaders(headerOptions)
  }
}

const request = ({ url, ...options }) => fetch(url, options)

module.exports = options => (
  pipe(options)(parseQuery, parseUrl, parseHeaders, request)
)
