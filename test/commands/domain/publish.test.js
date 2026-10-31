import { expect, test } from '@oclif/test'
import inquirer from 'inquirer'
import config from '../../../src/config/index.js'
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

  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .nock(`${shubUrl}/domains`, domain => domain
    .put('/org/domain/1.0.0/settings/lifecycle', { published: true })
    .reply(424, '{ "code": 424, "message": "conflict detected"}')
  )
  .stub(inquirer, 'prompt', stub => stub.returns(Promise.resolve({ answer: true })))
  .nock(`${shubUrl}/domains`, domain => domain
    .put('/org/domain/1.0.0/settings/lifecycle?force=true', { published: true })
    .reply(200)
  )
  .stdout()
  .command(['domain:publish', 'org/domain/1.0.0'])
  .it('runs domain:publish with \'Yes\' on confirmation', ctx => {
    expect(ctx.stdout).to.contain('Published domain org/domain/1.0.0')
  })

  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .nock(`${shubUrl}/domains`, domain => domain
    .put('/org/domain/1.0.0/settings/lifecycle?force=true', { published: true })
    .reply(200)
  )
  .stdout()
  .command(['domain:publish', 'org/domain/1.0.0', '--force'])
  .it('runs domain:publish with force argument', ctx => {
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

  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .stub(inquirer, 'prompt', stub => stub.returns(Promise.resolve({ answer: false })))
  .nock(`${shubUrl}/domains`, domain => domain
    .put('/org/domain/1.2.3/settings/lifecycle')
    .reply(424, '{ "code": 424, "message": "conflict detected" }')
  )
  .command(['domain:publish', 'org/domain/1.2.3'])
  .it('runs domain:publish with \'No\' on confirmation (no retry)')

  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .nock(`${shubUrl}/domains`, domain => domain
    .put('/org/domain/1.2.3/settings/lifecycle')
    .reply(500, '{ "code": 500, "message": "server error" }')
  )
  .command(['domain:publish', 'org/domain/1.2.3'])
  .exit(2)
  .it('runs domain:publish with non-424 error handled by handleErrors')
})
