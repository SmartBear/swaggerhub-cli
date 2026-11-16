import { expect, test } from '@oclif/test'
import config from '../../../src/config/index.js'
const shubUrl = 'https://api.swaggerhub.com'
const forkBody = { owner: 'myorg', name: 'api-fork', version: '2.0.0' }

describe('valid api:fork', () => {
  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/apis/org/name/1.0.0/fork', forkBody)
          .reply(201)
      )
      .stdout()
      .command(['api:fork', 'org/name/1.0.0', 'myorg/api-fork/2.0.0'])
      .it('runs api:fork without optional flags', ctx => {
        expect(ctx.stdout).to.contain('Forked API \'org/name/1.0.0\' as \'myorg/api-fork/2.0.0\'')
      })

  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/apis/org/name/1.0.0/fork', { ...forkBody, project: 'proj', private: true })
          .reply(201)
      )
      .stdout()
      .command(['api:fork', 'org/name/1.0.0', 'myorg/api-fork/2.0.0', '--project', 'proj', '--visibility', 'private'])
      .it('sends project and private=true', ctx => {
        expect(ctx.stdout).to.contain('Forked API')
      })

  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/apis/org/name/1.0.0/fork', { ...forkBody, private: false })
          .reply(201)
      )
      .stdout()
      .command(['api:fork', 'org/name/1.0.0', 'myorg/api-fork/2.0.0', '--visibility', 'public'])
      .it('sends private=false for public visibility', ctx => {
        expect(ctx.stdout).to.contain('Forked API')
      })
})

describe('failing api:fork', () => {
  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/apis/org/name/1.0.0/fork', forkBody)
          .reply(409, { code: 409, message: 'Version already exists' })
      )
      .stdout()
      .command(['api:fork', 'org/name/1.0.0', 'myorg/api-fork/2.0.0'])
      .exit(2)
      .it('handles 409 from api:fork', ctx => {
        expect(ctx.stdout).to.contain('Forking API')
      })
})

describe('invalid api:fork command', () => {
  test
      .command(['api:fork'])
      .catch(err => {
        expect(err.message).to.contain('Missing 2 required args')
      })
      .it('requires both arguments')

  test
      .command(['api:fork', 'org/name', 'myorg/api-fork/2.0.0'])
      .catch(err => {
        expect(err.message).to.contain('Argument must match')
      })
      .it('requires a version in the source identifier')

  test
      .command(['api:fork', 'org/name/1.0.0', 'myorg/api-fork'])
      .catch(err => {
        expect(err.message).to.contain('Argument must match NEW_OWNER/NEW_API_NAME/NEW_VERSION format')
      })
      .it('rejects an incomplete target')
})
