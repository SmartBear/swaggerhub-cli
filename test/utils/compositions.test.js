const { expect, test } = require('@oclif/test')
const { pipe } = require('../../src/utils/compositions')
const mock = require('../__mocks__/config')
const isEqual = require('lodash/isEqual')

const { setConfig, getConfig } = require('../../src/utils/config')

describe('compositions ', () => {
  describe('pipe', () => {
    test.it('should pipe (left to right) ouput of 1st function through input of the next', () => {
      const doubleIt = x => x * 2
      const trebleIt = x => x * 3
      const quadrupleIt = x => x * 4

      const output = pipe(1)(doubleIt, trebleIt, quadrupleIt)
      
      expect(output).to.equal(24)
    })
  })
})
  