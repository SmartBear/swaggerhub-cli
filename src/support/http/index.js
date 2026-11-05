import fetch from 'node-fetch'
import qs from 'querystring'
import headerTemplates from './header-templates.js'
import defaultHeaders from './default-headers.js'
import { agentFor } from './proxy-agent.js'

import { pipe, pick, omit } from '../../utils/general.js'

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
    headers: {
      ...defaultHeaders(),
      ...buildHeaders(headerOptions)
    }
  }
}

const request = ({ url, ...options }) => fetch(url, { agent: agentFor, ...options })

export default options => (
  pipe(parseQuery, parseUrl, parseHeaders, request)(options)
)
