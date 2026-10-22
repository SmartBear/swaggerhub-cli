const { getProxyForUrl } = require('proxy-from-env')
const { HttpsProxyAgent } = require('https-proxy-agent')
const { HttpProxyAgent } = require('http-proxy-agent')

const normalizeProxy = proxy => {
  try {
    return new URL(proxy).href
  } catch {
    throw new Error('Invalid proxy URL in HTTP_PROXY/HTTPS_PROXY environment variable')
  }
}

const agentFor = parsedUrl => {
  const proxy = getProxyForUrl(parsedUrl.href)
  if (!proxy) {
    return undefined
  }

  const proxyUrl = normalizeProxy(proxy)
  return parsedUrl.protocol === 'https:' ?
    new HttpsProxyAgent(proxyUrl) :
    new HttpProxyAgent(proxyUrl)
}

module.exports = { agentFor }
