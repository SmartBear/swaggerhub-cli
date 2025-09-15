const { expect, test } = require('@oclif/test')
const { checkForErrors, getResponseContent, handleErrors, parseResponse } = require('../../src/support/command/handle-response')

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

describe('getResponseContent', () => {
    test.it('test error returned when getResponseContent called with no parameters', async () => {
        try {
            await getResponseContent()
        } catch (err) {
            expect(err.message).to.equal('No content field provided')
        }
    })
})


describe('parseResponse', () => {
  test.it('should parse application/zip response as buffer', async () => {
    const mockBuffer = Buffer.from('PK\x03\x04', 'binary')
    const response = {
      status: 200,
      ok: true,
      headers: {
        get: (header) => header === 'content-type' ? 'application/zip' : ''
      },
      buffer: () => Promise.resolve(mockBuffer)
    }

    const result = await parseResponse(response)
    expect(result.status).to.equal(200)
    expect(result.ok).to.equal(true)
    expect(result.content).to.deep.equal(mockBuffer)
  })

  test.it('should parse application/json response as text', async () => {
    const mockText = '{"key":"value"}'
    const response = {
      status: 200,
      ok: true,
      headers: {
        get: (header) => header === 'content-type' ? 'application/json' : ''
      },
      text: () => Promise.resolve(mockText)
    }

    const result = await parseResponse(response)
    expect(result.status).to.equal(200)
    expect(result.ok).to.equal(true)
    expect(result.content).to.equal(mockText)
  })
})