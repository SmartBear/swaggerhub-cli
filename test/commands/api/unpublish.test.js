const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const shubUrl = 'https://test-api.swaggerhub.com'

describe('valid api:unpublish', () => {
  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .nock(`${shubUrl}/apis`, api => api
    .put('/org/api/1.0.0/settings/lifecycle', { published: false })
    .reply(200)
  )
  .stdout()
  .command(['api:unpublish', 'org/api/1.0.0'])
  .it('runs api:unpublish with identifier', ctx => {
    expect(ctx.stdout).to.contain('Unpublished API org/api/1.0.0')
  })
})

describe('invalid apis:unpublish', () => {
  test
  .command(['api:unpublish'])
  .exit(2)
  .it('runs api:unpublish with no identifier provided')

  test
  .command(['api:unpublish', 'owner/api'])
  .exit(2)
  .it('runs api:unpublish without version in identifier')

  test
  .command(['api:unpublish', 'owner/api/version', '--testing'])
  .exit(2)
  .it('runs api:unpublish with unrecognised flag')

  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .nock(`${shubUrl}/apis`, api => api
    .put('/org/api/1.2.3/settings/lifecycle')
    .reply(404, '{ "code": 404, "message": "Unknown API org/api:1.2.3"}')
  )
  .command(['api:unpublish', 'org/api/1.2.3'])
  .exit(2)
  .it('runs api:unpublish with invalid API version')
})
