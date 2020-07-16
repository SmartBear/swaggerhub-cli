const { expect, test } = require('@oclif/test')
const { pipe } = require('../../src/utils/general')

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
  