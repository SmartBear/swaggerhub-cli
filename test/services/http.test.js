const { expect } = require('@oclif/test')
const { acceptHeader, reqType } = require('../../src/services/http')


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

describe('reqType returns correct type', () => {

    context('reqType({json:true})', () => {
      it('should be json', function() {
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
