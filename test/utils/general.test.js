const { expect, test } = require('@oclif/test')
const { pipe, getJsonPointer, jsonPointerToArray } = require('../../src/utils/general')

describe('utils/general ', () => {

  describe('pipe', () => {
    test.it('should pipe (left to right) ouput of 1st function through input of the next', () => {
      const doubleIt = x => x * 2
      const trebleIt = x => x * 3
      const quadrupleIt = x => x * 4

      const output = pipe(doubleIt, trebleIt, quadrupleIt)(1)

      expect(output).to.equal(24)
    })
  })


  describe('jsonPointerToArray', () => {
    test.it('should tokenize a JSON Pointer', () => {
      const output = jsonPointerToArray('/info/version')
      expect(output).to.eql(['info', 'version'])
    })


    test.it('should handle escaped ~ and /', () => {
      const output = jsonPointerToArray('/paths/~1foo/get/x-~0')
      expect(output).to.eql(['paths', '/foo', 'get', 'x-~'])
    })
  })

  describe('getJsonPointer', () => {
    test.it('should return /info/version from json object', () => {
      const output = getJsonPointer({ info: { version: '1.2.3' } }, '/info/version')
      expect(output).to.equal('1.2.3')
    })
  })


  describe('getJsonPointer', () => {
    test.it('should return the root value with path = "/"', () => {
      const output = getJsonPointer({ info: { version: '1.2.3' } }, '/')
      expect(output).to.eql({
        info: {
          version: '1.2.3'
        }
      })
    })
  })


})
