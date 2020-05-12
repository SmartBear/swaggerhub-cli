const { expect } = require('@oclif/test')
const { acceptHeader, reqType } = require('../../src/services/http')


describe('acceptHeader returns correct headers', function() {

    context('acceptHeader(json)', function() {
      it('should be true', function() {
        expect(acceptHeader('json').Accept).to.equal('application/json')
      })
    })

    context('acceptHeader(yaml)', function() {
        it('should be true', function() {
          expect(acceptHeader('yaml').Accept).to.equal('application/yaml')
        })
      })
    
})

describe('reqType returns correct type', function() {

    context('reqType({json:true})', function() {
      it('should be json', function() {
        expect(reqType({'json':true})).to.equal('json')
      })
    })

    context('reqType({json:false})', function() {
        it('should be yaml', function() {
          expect(reqType({'json':false})).to.equal('yaml')
        })
    })

    context('reqType({})', function() {
        it('should be yaml', function() {
            expect(reqType({})).to.equal('yaml')
        })
    })
    
})
