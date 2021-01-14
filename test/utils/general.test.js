const { expect, test } = require('@oclif/test')
const { from, hasJsonStructure, pipe, prettyPrintJSON } = require('../../src/utils/general')

describe('compositions ', () => {
  describe('pipe', () => {
    test.it('should pipe (left to right) ouput of 1st function through input of the next', () => {
      const doubleIt = x => x * 2
      const trebleIt = x => x * 3
      const quadrupleIt = x => x * 4

      const output = pipe(doubleIt, trebleIt, quadrupleIt)(1)
      
      expect(output).to.equal(24)
    })
  })
})

describe('prettyPrintJSON', () => {
  test.it('should format a json string with new lines and indentation', () => {
    const str = '{"a":true,"b":{"c":1,"d":"2"}}'

    const output = prettyPrintJSON(str)
    
    expect(output).to.equal('{\n  "a": true,\n  "b": {\n    "c": 1,\n    "d": "2"\n  }\n}')
  })
})

describe('from', () => {
  test.it('should evaluate the function', () => {
    const doubleIt = x => x * 2

    const output = from(4)(doubleIt)
    
    expect(output).to.equal(8)
  })
  test.it('should evaluate two functions', () => {
    const doubleIt = x => x * 2
    const trebleIt = x => x * 3

    const [doubled, trebled] = from(4)(doubleIt, trebleIt)
    
    expect(doubled).to.equal(8)
    expect(trebled).to.equal(12)
  })
})

describe('hasJsonStructure', () => {
  test.it('should read array as json', () => {
    const str = '["one", "two", "three"]'

    const output = hasJsonStructure(str)
    
    expect(output).to.equal(true)
  })
})