const { expect } = require('@oclif/test')
const { HttpsProxyAgent } = require('https-proxy-agent')
const { HttpProxyAgent } = require('http-proxy-agent')
const { agentFor } = require('../../src/support/http/proxy-agent')

const proxyKeys = ['HTTP_PROXY', 'http_proxy', 'HTTPS_PROXY', 'https_proxy', 'NO_PROXY', 'no_proxy']

describe('proxy-agent', () => {
  let saved

  beforeEach(() => {
    saved = {}
    proxyKeys.forEach(key => {
      saved[key] = process.env[key]
      delete process.env[key]
    })
  })

  afterEach(() => {
    proxyKeys.forEach(key => {
      if (saved[key] === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = saved[key]
      }
    })
  })

  it('should return undefined when no proxy is configured', () => {
    expect(agentFor(new URL('https://api.swaggerhub.com/apis'))).to.equal(undefined)
  })

  it('should use HTTPS_PROXY for https URLs', () => {
    process.env.HTTPS_PROXY = 'http://proxy.test:8080'
    const agent = agentFor(new URL('https://api.swaggerhub.com/apis'))
    expect(agent).to.be.instanceOf(HttpsProxyAgent)
    expect(agent.proxy.href).to.equal('http://proxy.test:8080/')
  })

  it('should use HTTP_PROXY for http URLs', () => {
    process.env.HTTP_PROXY = 'http://proxy.test:8080'
    expect(agentFor(new URL('http://swaggerhub.test/v1/apis'))).to.be.instanceOf(HttpProxyAgent)
  })

  it('should not use HTTP_PROXY for https URLs', () => {
    process.env.HTTP_PROXY = 'http://proxy.test:8080'
    expect(agentFor(new URL('https://api.swaggerhub.com/apis'))).to.equal(undefined)
  })

  it('should bypass the proxy for hosts matching NO_PROXY', () => {
    process.env.HTTPS_PROXY = 'http://proxy.test:8080'
    process.env.NO_PROXY = 'swaggerhub.internal'
    expect(agentFor(new URL('https://swaggerhub.internal/v1/apis'))).to.equal(undefined)
  })

  it('should preserve proxy credentials', () => {
    process.env.HTTPS_PROXY = 'http://user:pass@proxy.test:8080'
    const { proxy } = agentFor(new URL('https://api.swaggerhub.com/apis'))
    expect(proxy.username).to.equal('user')
    expect(proxy.password).to.equal('pass')
  })

  it('should throw a clear error for an invalid proxy URL', () => {
    process.env.HTTPS_PROXY = 'http://'
    expect(() => agentFor(new URL('https://api.swaggerhub.com/apis'))).to.throw(/Invalid proxy URL/)
  })
})
