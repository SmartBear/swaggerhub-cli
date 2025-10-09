const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const shubUrl = 'https://test-api.swaggerhub.com'

describe('valid domain:publish', () => {
  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .nock(`${shubUrl}/domains`, domain => domain
    .put('/org/domain/1.0.0/settings/lifecycle', { published: true })
    .reply(200)
  )
  .stdout()
  .command(['domain:publish', 'org/domain/1.0.0'])
  .it('runs domain:publish with identifier', ctx => {
    expect(ctx.stdout).to.contain('Published domain org/domain/1.0.0')
  })
})

describe('invalid domains:publish', () => {
  test
  .command(['domain:publish'])
  .exit(2)
  .it('runs domain:publish with no identifier provided')

  test
  .command(['domain:publish', 'owner/domain'])
  .exit(2)
  .it('runs domain:publish without version in identifier')

  test
  .command(['domain:publish', 'owner/domain/version', '--testing'])
  .exit(2)
  .it('runs domain:publish with unrecognised flag')

  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .nock(`${shubUrl}/domains`, domain => domain
    .put('/org/domain/1.2.3/settings/lifecycle')
    .reply(404, '{ "code": 404, "message": "Unknown domain org/domain:1.2.3"}')
  )
  .command(['domain:publish', 'org/domain/1.2.3'])
  .exit(2)
  .it('runs domain:publish with invalid domain version')
})
