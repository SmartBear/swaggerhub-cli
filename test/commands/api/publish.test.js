const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const shubUrl = 'https://test-api.swaggerhub.com'

describe('valid api:publish', () => {
  test
  .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
  .nock('https://test-api.swaggerhub.com/apis', api => api
    .put('/org/api/1.0.0/settings/lifecycle', { published: true })
    .reply(200)
  )
  .stdout()
  .command(['api:publish', 'org/api/1.0.0'])
  .it('runs api:publish with identifier', ctx => {
    expect(ctx.stdout).to.contains('Published API org/api/1.0.0')
  })
})

describe('invalid apis:publish', () => {
  test
  .command(['api:publish'])
  .exit(2)
  .it('runs api:publish with no identifier provided')

  test
  .command(['api:publish', 'owner/api'])
  .exit(2)
  .it('runs api:publish without version in identifier')

  test
  .command(['api:publish', 'owner/api/version', '--testing'])
  .exit(2)
  .it('runs api:publish with unrecognised flag')

  test
  .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
  .nock('https://test-api.swaggerhub.com/apis', api => api
    .put('/org/api/1.2.3/settings/lifecycle')
    .reply(404, '{ "code": 404, "message": "Unknown API org/api:1.2.3"}')
  )
  .command(['api:publish', 'org/api/1.2.3'])
  .exit(2)
  .it('runs api:publish with invalid API version')
})
