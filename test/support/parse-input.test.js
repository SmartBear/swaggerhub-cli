const { expect } = require('@oclif/test')
const { CLIError } = require('@oclif/errors') 
const { parseDefinition } = require('../../src/utils/oas')
const { 
  validateObjectIdentifier, 
  getApiIdentifierArg, 
  getDomainIdentifierArg,
  reqType 
} = require('../../src/support/command/parse-input')

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
})

describe('getApiIdentifierArg', () => {

  context('valid version identifier', () => {
    it('should be returned', () => {
      expect(getApiIdentifierArg({ 'OWNER/API_NAME/VERSION': 'owner/api/123' })).to.equal('owner/api/123')
    })
  })

  context('valid identifier', () => {
    it('should be returned', () => {
      expect(getApiIdentifierArg({ 'OWNER/API_NAME/[VERSION]': 'owner/api' }, false)).to.equal('owner/api')
    })
  })

  context('invalid identifier', () => {
    it('should throw an exception', () => {
      expect(() => { getApiIdentifierArg({ 'OWNER/API_NAME/VERSION': 'owner/api/version/extra' })}).to.throw(CLIError)
    })
  })

  context('invalid identifier with space', () => {
    it('should throw an exception', () => {
      expect(() => { getApiIdentifierArg({ 'OWNER/API_NAME/VERSION': 'owner/api name/version' })}).to.throw(CLIError)
    })
  })

  context('invalid identifier with space and no version', () => {
    it('should throw an exception', () => {
      expect(() => { getApiIdentifierArg({ 'OWNER/API_NAME/[VERSION]': 'owner/api name' }, false)}).to.throw(CLIError)
    })
  })

  context('invalid identifier with version required', () => {
    it('should throw an exception', () => {
      expect(() => { getApiIdentifierArg({ 'OWNER/API_NAME/VERSION': 'owner/api' })}).to.throw(CLIError)
    })
  })
})

describe('getDomainIdentifierArg', () => {

  context('valid version identifier', () => {
    it('should be returned', () => {
      expect(getDomainIdentifierArg({ 'OWNER/DOMAIN_NAME/VERSION': 'owner/domain/123' })).to.equal('owner/domain/123')
    })
  })

  context('valid identifier', () => {
    it('should be returned', () => {
      expect(getDomainIdentifierArg({ 'OWNER/DOMAIN_NAME/[VERSION]': 'owner/domain' }, false)).to.equal('owner/domain')
    })
  })

  context('invalid identifier', () => {
    it('should throw an exception', () => {
      expect(() => { getDomainIdentifierArg({ 'OWNER/DOMAIN_NAME/VERSION': 'owner/domain/version/extra' })})
        .to.throw(CLIError)
    })
  })

  context('invalid identifier with space', () => {
    it('should throw an exception', () => {
      expect(() => { getDomainIdentifierArg({ 'OWNER/DOMAIN_NAME/VERSION': 'owner/domain name/version' })})
        .to.throw(CLIError)
    })
  })

  context('invalid identifier with space and no version', () => {
    it('should throw an exception', () => {
      expect(() => { getDomainIdentifierArg({ 'OWNER/DOMAIN_NAME/[VERSION]': 'owner/domain name' }, false)})
        .to.throw(CLIError)
    })
  })

  context('invalid identifier with version required', () => {
    it('should throw an exception', () => {
      expect(() => { getDomainIdentifierArg({ 'OWNER/DOMAIN_NAME/VERSION': 'owner/domain' })}).to.throw(CLIError)
    })
  })
})

describe('parseDefinition', () => {
  context('call parseDefinition with nonexistent file', () => {
    it('should throw an exception', () => {
      expect(() => { parseDefinition('test/resources/missing_file.yaml')}).to.throw(CLIError)
    })
  })

  context('call parseDefinition with empty file', () => {
    it('should throw an exception', () => {
      expect(() => { parseDefinition('test/resources/empty.yaml')}).to.throw(CLIError)
    })
  })
})