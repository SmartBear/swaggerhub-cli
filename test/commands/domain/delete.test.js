const { expect, test } = require('@oclif/test')
const inquirer = require('inquirer')
const config = require('../../../src/config')
const domainId = 'org/domain'
const versionId = 'org/domain/1.0.0'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('valid domain:delete', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .delete('/org/domain/1.0.0')
      .query({ force: 'true' })
      .reply(200)
    )
    .stdout()
    .command(['domain:delete', versionId])
    .it('runs domain:delete on domain version', ctx => {
      expect(ctx.stdout).to.contains(`Deleted version 1.0.0 of domain '${domainId}'`)
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .stub(inquirer, 'prompt', () => Promise.resolve({ answer: true }))
    .nock(`${shubUrl}/domains`, domain => domain
      .delete('/org/domain')
      .query({ force: 'true' })
      .reply(200)
    )
    .stdout()
    .command(['domain:delete', domainId])
    .it('runs domain:delete on domain defintion', ctx => {
      expect(ctx.stdout).to.contains(`Deleted domain '${domainId}'`)
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .stub(inquirer, 'prompt', () => Promise.resolve({ answer: false }))
    .stdout()
    .command(['domain:delete', domainId])
    .it('runs domain:delete on domain, enter \'No\' on confirmation')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .delete('/org/domain')
      .query({ force: 'true' })
      .reply(200)
    )
    .stdout()
    .command(['domain:delete', domainId, '-f'])
    .it('runs domain:delete on domain defintion with -f flag', ctx => {
      expect(ctx.stdout).to.contains(`Deleted domain '${domainId}'`)
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .delete('/org/domain')
      .query({ force: 'true' })
      .reply(200)
    )
    .stdout()
    .command(['domain:delete', domainId, '--force'])
    .it('runs domain:delete on domain defintion with --force flag', ctx => {
      expect(ctx.stdout).to.contains(`Deleted domain '${domainId}'`)
    })
})

describe('invalid domain:delete command issues', () => {
  test
    .command(['domain:delete'])
    .exit(2)
    .it('runs domain:delete with no identifier provided')

  test
    .command(['domain:delete', 'owner'])
    .exit(2)
    .it('runs domain:delete with only org identifier provided')
})


describe('domain:delete error responses', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .delete('/org/domain')
      .query({ force: 'true' })
      .reply(404, `{ "code": 404, "message": "Unknown domain ${domainId}"}`)
    )
    .command(['domain:delete', domainId, '-f'])
    .catch(ctx => {
      expect(ctx.message).to.contain(`Unknown domain ${domainId}`)
    })
    .it('runs domain:delete with domain that does not exist')
})
