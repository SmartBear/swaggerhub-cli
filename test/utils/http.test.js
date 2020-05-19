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
  it('should return User-Agent header from config', () => {
      global.shUserAgent = 'swaggerhub-cli/1.2.3 darwin-x64'
      expect(userAgentHeader()['User-Agent']).to.equal(global.shUserAgent)
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
