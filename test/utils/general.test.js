const { expect, test } = require('@oclif/test')
const { hasJsonStructure, pipe, prettyPrintJSON, pick, omit, isEqual } = require('../../src/utils/general')

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

describe('hasJsonStructure', () => {
  test.it('should read array as json', () => {
    const str = '["one", "two", "three"]'

    const output = hasJsonStructure(str)
    
    expect(output).to.equal(true)
  })
})

describe('pick', () => {
  test.it('should only pick existing keys from object', () => {
    const obj = { 'hello': 'world', 'number': 1 }
    const keys = ['hello', 'nonExistantKey']

    const result = pick(obj, keys)

    expect(Object.keys(result)).to.eql(['hello'])
    expect(result.hello).to.equal('world')
  })
})

describe('omit', () => {
  test.it('should only remove specified keys from object', () => {
    const obj = { 'hello': 'world', 'number': 1 }
    const keys = ['hello', 'nonExistantKey']

    const result = omit(obj, keys)

    expect(Object.keys(result)).to.eql(['number'])
    expect(result.number).to.equal(1)
  })
})

describe('isEqual', () => {
  test.it('should return true if 2 objects are equal', () => {
    const world = 'world'
    const obj1 = { hello: 'world' }
    const obj2 = { 'hello': world }

    expect(isEqual(obj1, obj2)).to.equal(true)
  })

  test.it('should return false if 2 objects are not equal', () => {
    const mom = 'mom'
    const obj1 = { hello: 'world' }
    const obj2 = { 'hello': mom }

    expect(isEqual(obj1, obj2)).to.equal(false)
  })
})