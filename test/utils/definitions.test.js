const { expect, test } = require('@oclif/test')
const { getSpecification } = require('../../src/utils/definitions')

describe('getSpecification', () => {
  describe('should return `openapi-2.0`', () => {
    test.it('for `swagger: 2.0`', () => {
      const definition = { swagger: '2.0' }
  
      const specification = getSpecification(definition)
  
      expect(specification).to.equal('openapi-2.0')
    })
  })

  describe('should return `openapi-3.1.0`', () => {
    test.it('for `openapi: 3.1.0`', () => {
      const definition = { openapi: '3.1.0' }
  
      const specification = getSpecification(definition)
  
      expect(specification).to.equal('openapi-3.1.0')
    })
  
    test.it('for `openapi: 3.1.99`', () => {
      const definition = { openapi: '3.1.99' }
  
      const specification = getSpecification(definition)
  
      expect(specification).to.equal('openapi-3.1.0')
    })
  })
  
  describe('should return `openapi-3.0.0`', () => {
    test.it('for `openapi: 3.0.0`', () => {
      const definition = { openapi: '3.0.0' }
  
      const specification = getSpecification(definition)
  
      expect(specification).to.equal('openapi-3.0.0')
    })
  
    test.it('for `openapi: 3.0.99`', () => {
      const definition = { openapi: '3.0.99' }
  
      const specification = getSpecification(definition)
  
      expect(specification).to.equal('openapi-3.0.0')
    })
  
    test.it('for `openapi: 3.99.0`', () => {
      const definition = { openapi: '3.99.0' }
  
      const specification = getSpecification(definition)
  
      expect(specification).to.equal('openapi-3.0.0')
    })
  })

  describe('should return `asyncapi-2.x.x`', () => {
    test.it('for `asyncapi: 2.0.0`', () => {
      const definition = { asyncapi: '2.0.0' }
  
      const specification = getSpecification(definition)
  
      expect(specification).to.equal('asyncapi-2.x.x')
    })

    test.it('for `asyncapi: 2.6.99`', () => {
      const definition = { asyncapi: '2.6.99' }
  
      const specification = getSpecification(definition)
  
      expect(specification).to.equal('asyncapi-2.x.x')
    })

    test.it('for `asyncapi: 2.0.99`', () => {
      const definition = { asyncapi: '2.0.99' }
  
      const specification = getSpecification(definition)
  
      expect(specification).to.equal('asyncapi-2.x.x')
    })
  })

  describe('should default to `openapi-3.0.0`', () => {
    test.it('for `openapi: abcd`', () => {
      const definition = { openapi: 'abcd' }
  
      const specification = getSpecification(definition)
  
      expect(specification).to.equal('openapi-3.0.0')
    })
  
    test.it('for `openapi: 4.7.9`', () => {
      const definition = { openapi: '4.7.9' }
  
      const specification = getSpecification(definition)
  
      expect(specification).to.equal('openapi-3.0.0')
    })

    test.it('for `openapi: 😄`', () => {
      const definition = { openapi: '😄' }
  
      const specification = getSpecification(definition)
  
      expect(specification).to.equal('openapi-3.0.0')
    })

    test.it('for `asyncapi: blah`', () => {
      const definition = { asyncapi: 'blah' }
  
      const specification = getSpecification(definition)
  
      expect(specification).to.equal('openapi-3.0.0')
    })
  })
})
