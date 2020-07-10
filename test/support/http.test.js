const { expect, test } = require('@oclif/test')
const http = require('../../src/support/http')

const mockUrl = 'https://test.http.com'
const mockApiKey = 'mock-api-key-1234'
const mockReqBody = { test: '123', id: 'test' }
const mockReqQuery = mockReqBody
const mockUserAgent = 'mockUserAgent'

describe('http', () => {
  before(() => global.shUserAgent = mockUserAgent)
  after(() => delete global.shUserAgent)
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
        .matchHeader('authorization', `Bearer ${mockApiKey}`)
        .matchHeader('content-type', 'application/json')
        .matchHeader('accept', 'application/json')
        .matchHeader('user-agent', mockUserAgent)
        .reply(200)
      )
      .it('should create valid http headers from the provided options', async () => await http({
        url: [mockUrl, 'headers'],
        accept: 'json',
        contentType: 'json',
        auth: mockApiKey
      }))
    test
      .nock(mockUrl, api => api
        .get('/query')
        .query(mockReqQuery)
        .reply(200)
      )
      .it('should concatenate the provided query object to the url string', async () => {
        const expectedUrl = `${mockUrl}/query?test=123&id=test`
        const { url } = await http({
          url: [mockUrl, 'query'],
          query: mockReqQuery
        })

        expect(url).to.equal(expectedUrl)
    })
    test
      .nock(mockUrl, api => api
        .post('/body', mockReqBody)
        .reply(200)
      )
      .it('should post the provided body option', async () => await http({
          url: [mockUrl, 'body'],
          method: 'post',
          body: JSON.stringify(mockReqBody)
        })
      )
  })
})