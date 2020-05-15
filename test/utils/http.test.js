const { expect } = require('@oclif/test')
const { acceptHeader, authHeader, userAgentHeader, reqType } = require('../../src/utils/http')

describe('acceptHeader returns correct headers', () => {

  context('acceptHeader(json)', () => {
    it('should be true', () => {
      expect(acceptHeader('json').Accept).to.equal('application/json')
    })
  })

  context('acceptHeader(yaml)', () => {
    it('should be true', () => {
      expect(acceptHeader('yaml').Accept).to.equal('application/yaml')
    })
  })

})

describe('authHeader', () => {
  context('authHeader(apiKey)', () => {
    it('should return Authorization: Bearer ${apiKey}', () => {
      expect(authHeader('123').Authorization).to.equal('Bearer 123')
    })
  })
})

describe('userAgentHeader', () => {
  context('userAgentHeader(userAgent)', () => {
    it('should return User-Agent: swaggerhub/1.2.3 darwin-x64 node-v13.8.0', () => {
      const userAgent = 'swaggerhub/1.2.3 darwin-x64 node-v13.8.0'
      const expectedUserAgent = 'swaggerhub-cli/1.2.3 darwin-x64 node-v13.8.0'
      expect(userAgentHeader(userAgent, 'swaggerhub')['User-Agent']).to.equal(expectedUserAgent)
    })
  })
})

describe('reqType returns correct type', () => {

  context('reqType({json:true})', () => {
    it('should be json', () => {
      expect(reqType({ 'json': true })).to.equal('json')
    })
  })

  context('reqType({json:false})', () => {
    it('should be yaml', () => {
      expect(reqType({ 'json': false })).to.equal('yaml')
    })
  })

  context('reqType({})', () => {
    it('should be yaml', () => {
      expect(reqType({})).to.equal('yaml')
    })
  })
})
