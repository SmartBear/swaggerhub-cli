const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const shubUrl = 'https://test-api.swaggerhub.com'

describe('valid domain:setdefault', () => {
  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .nock(`${shubUrl}/domains`, domain => domain
    .put('/org/domain/settings/default', { version: '2.0.0' })
    .reply(200)
  )
  .stdout()
  .command(['domain:setdefault', 'org/domain/2.0.0'])
  .it('runs domain:setdefault with identifier', ctx => {
    expect(ctx.stdout).to.contains('Default version of org/domain set to 2.0.0')
  })
})

describe('invalid domain:setdefault', () => {
  test
  .command(['domain:setdefault'])
  .exit(2)
  .it('runs domain:setdefault with no identifier provided')

  test
  .stderr()
  .command(['domain:setdefault', 'owner/domain'])
  .exit(2)
  .it('runs domain:setdefault without version in identifier')

  test
  .command(['domain:setdefault', 'owner/domain/version', '--testing'])
  .exit(2)
  .it('runs domain:setdefault with unrecognised flag')

  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .nock(`${shubUrl}/domains`, domain => domain
    .put('/org/domain/settings/default', { version: '1.2.3' })
    .reply(404, '{ "code": 404, "message": "Unknown domain org/domain:1.2.3"}')
  )
  .command(['domain:setdefault', 'org/domain/1.2.3'])
  .exit(2)
  .it('runs domain:setdefault with invalid domain version')
})
