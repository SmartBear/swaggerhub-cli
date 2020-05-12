const { expect, test } = require('@oclif/test')
const { validateObjectIdentifier } = require('../../src/services/input-validation')


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
      it('should be false', function() {
        expect(validateObjectIdentifier('invalid_id/')).to.equal(false)
      })
    })

    context('testing owner/api idenfitier', () => {
      it('should be false', () => {
        expect(validateObjectIdentifier('owner/api')).to.equal(false)
      })
    })
    
})