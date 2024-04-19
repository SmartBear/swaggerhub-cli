const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const shubUrl = 'https://test-api.swaggerhub.com'

describe('valid api:setdefault', () => {
  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .nock(`${shubUrl}/apis`, api => api
    .put('/org/api/settings/default', { version: '2.0.0' })
    .reply(200)
  )
  .stdout()
  .command(['api:setdefault', 'org/api/2.0.0'])
  .it('runs api:setdefault with identifier', ctx => {
    expect(ctx.stdout).to.contains('Default version of org/api set to 2.0.0')
  })
})

describe('invalid apis:setdefault', () => {
  test
  .command(['api:setdefault'])
  .exit(2)
  .it('runs api:setdefault with no identifier provided')

  test
  .stderr()
  .command(['api:setdefault', 'owner/api'])
  .exit(2)
  .it('runs api:setdefault without version in identifier')

  test
  .command(['api:setdefault', 'owner/api/version', '--testing'])
  .exit(2)
  .it('runs api:setdefault with unrecognised flag')

  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .nock(`${shubUrl}/apis`, api => api
    .put('/org/api/settings/default', { version: '1.2.3' })
    .reply(404, '{ "code": 404, "message": "Unknown API org/api:1.2.3"}')
  )
  .command(['api:setdefault', 'org/api/1.2.3'])
  .exit(2)
  .it('runs api:setdefault with invalid API version')
})
