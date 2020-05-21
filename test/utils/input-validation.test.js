const { expect } = require('@oclif/test')
const { CLIError } = require('@oclif/errors') 

const { validateObjectIdentifier, getIdentifierArg, reqType } = require('../../src/utils/input-validation')

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


describe('Validate Object Identifier', () => {

  context('testing valid owner/api/version identifier', () => {
    it('should be true', () => {
      expect(validateObjectIdentifier('owner/api/123')).to.equal(true)
    })
  })

  context('testing valid api name with _ and -', () => {
    it('should be true', () => {
      expect(validateObjectIdentifier('owner/api-name_v2/12')).to.equal(true)
    })
  })

  context('testing valid version id using semantic versioning', () => {
    it('should be true', () => {
      expect(validateObjectIdentifier('MichaelMelodyDemoOrg/testing/1.0.0')).to.equal(true)
    })
  })


  context('testing invalid owner/api/version idenfitier', () => {
    it('should be false', function () {
      expect(validateObjectIdentifier('invalid_id/')).to.equal(false)
    })
  })

  context('testing owner/api idenfitier', () => {
    it('should be false', () => {
      expect(validateObjectIdentifier('owner/api')).to.equal(false)
    })
  })
})

describe('getIdentifierArg', () => {

  context('valid identifier', () => {
    it('should be returned', () => {
      expect(getIdentifierArg({ identifier: 'owner/api/123' })).to.equal('owner/api/123')
    })
  })

  context('invalid identifier', () => {
    it('should be throw an exception', () => {
      expect(() => { getIdentifierArg({ identifier: 'owner/api' })}).to.throw(CLIError)
    })
  })
})