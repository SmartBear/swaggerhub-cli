const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const shubUrl = 'https://test-api.swaggerhub.com'

describe('valid domain:unpublish', () => {
  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .nock(`${shubUrl}/domains`, domain => domain
    .put('/org/domain/1.0.0/settings/lifecycle', { published: false })
    .reply(200)
  )
  .stdout()
  .command(['domain:unpublish', 'org/domain/1.0.0'])
  .it('runs domain:unpublish with identifier', ctx => {
    expect(ctx.stdout).to.contain('Unpublished domain org/domain/1.0.0')
  })
})

describe('invalid domains:unpublish', () => {
  test
  .command(['domain:unpublish'])
  .exit(2)
  .it('runs domain:unpublish with no identifier provided')

  test
  .command(['domain:unpublish', 'owner/domain'])
  .exit(2)
  .it('runs domain:unpublish without version in identifier')

  test
  .command(['domain:unpublish', 'owner/domain/version', '--testing'])
  .exit(2)
  .it('runs domain:unpublish with unrecognised flag')

  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .nock(`${shubUrl}/domains`, domain => domain
    .put('/org/domain/1.2.3/settings/lifecycle')
    .reply(404, '{ "code": 404, "message": "Unknown domain org/domain:1.2.3"}')
  )
  .command(['domain:unpublish', 'org/domain/1.2.3'])
  .exit(2)
  .it('runs domain:unpublish with invalid domain version')
})
