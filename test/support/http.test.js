const { expect, test } = require('@oclif/test')
const pick = require('lodash/pick')
const http = require('../../src/support/http')
const isEqual = require('lodash/isEqual')

// For some reason nock wraps req.header values in an array.
// We need to flatten these back to string values. This is pretty crap for testing purposes,
// but there doesn't seem to be another way to assert the request headers.
const formatNockHeaders = reqHeaders => Object.keys(reqHeaders)
  .reduce((formattedHeaders, key) => ({
    [key]: Array.isArray(reqHeaders[key]) ? reqHeaders[key].join() : reqHeaders[key],
    ...formattedHeaders
  }), {})

const mockUrl = 'https://test.http.com'
const mockApiKey = 'mock-api-key-1234'

describe('http', () => {
  describe('default function', () => {
    test
      .nock(mockUrl, api => api
        .get('/path1/path2')
        .reply(200)
      )
      .it('should join the strings in url array with "/"', async () => {
        const expectedUrl = `${mockUrl}/path1/path2`

        const { url } = await http({
          url: [mockUrl, 'path1', 'path2']
        })

        expect(url).to.equal(expectedUrl)
    })
    test
      .nock(mockUrl, api => api
        .get('/headers')
        .reply(200, function(){
          return {
            headers: formatNockHeaders(this.req.headers)
          }
        })
      )
      .it('should create valid http headers from the provided options', async () => {
        const expectedHeaders = {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': `Bearer ${mockApiKey}`
        }

        const request = await http({
          url: [mockUrl, 'headers'],
          accept: 'json',
          contentType: 'json',
          auth: mockApiKey
        })

        const { headers } = await request.json()

        const requestHeaders = pick(headers, ['accept', 'content-type', 'authorization'])

        expect(isEqual(requestHeaders, expectedHeaders)).to.equal(true)
    })
    test
      .nock(mockUrl, api => api
        .get('/query?test=true&queryString=test')
        .reply(200)
      )
      .it('should concatenate the provided query object to the url string', async () => {
        const expectedUrl = `${mockUrl}/query?test=true&queryString=test`
        const { url } = await http({
          url: [mockUrl, 'query'],
          query: { test: true, queryString: 'test' }
        })

        expect(url).to.equal(expectedUrl)
    })
  })
})