import { getProxyForUrl } from 'proxy-from-env'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { HttpProxyAgent } from 'http-proxy-agent'

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

export { agentFor }