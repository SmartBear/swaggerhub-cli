const { expect, test } = require('@oclif/test')
const { validateObjectIdentifier } = require('../../src/services/input-validation')


describe('Validate Object Identifier', function() {

    context('testing valid owner/api/version idenfitier', function() {
      it('should be true', function() {
        expect(validateObjectIdentifier('owner/api/123')).to.equal(true)
      })
    })

    context('testing invalid owner/api/version idenfitier', function() {
      it('should be false', function() {
        expect(validateObjectIdentifier('invalid_id/')).to.equal(false)
      })
    })

    context('testing owner/api idenfitier', function() {
      it('should be false', function() {
        expect(validateObjectIdentifier('owner/api')).to.equal(false)
      })
    })
    
})