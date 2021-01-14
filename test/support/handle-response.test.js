const { expect, test } = require('@oclif/test')
const { checkForErrors, handleErrors } = require('../../src/support/command/handle-response')

describe('checkForErrors', () => {
    test.it('should return resolved promise', async () => {
      const resolved = await checkForErrors()({ status: 200, ok: true })
        .then(() => true)
        .catch(() => false)
      expect(resolved).to.equal(true)
    })
    test.it('should return rejected promise', async () => {
      const resolved = await checkForErrors()({ status: 404, ok: false })
        .then(() => true)
        .catch(() => false)
      expect(resolved).to.equal(false)
    })
    test.it('should return resolved promise using resolveStatus', async () => {
      const resolved = await checkForErrors({ resolveStatus: [403] })({ status: 403, ok: false })
        .then(() => true)
        .catch(() => false)
      expect(resolved).to.equal(true)
    })
    test.it('should return rejected promise with resolveStatus', async () => {
      const resolved = await checkForErrors({ resolveStatus: [403] })({ status: 404, ok: false })
        .then(() => true)
        .catch(() => false)
      expect(resolved).to.equal(false)
    })
})

describe('handleErrors', () => {
    test.it('test error response not in JSON format', () => {
        try {
            handleErrors({ content: 'Not json format' })
        } catch (err) {
            expect(err.message).to.equal('Unknown Error')
        }
    })
})