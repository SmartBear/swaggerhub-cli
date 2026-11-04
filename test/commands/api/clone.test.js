const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const shubUrl = 'https://api.swaggerhub.com'

describe('valid api:clone', () => {
  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/apis/org/name/1.0.0/clone', { version: '1.0.1' })
          .reply(201)
      )
      .stdout()
      .command(['api:clone', 'org/name/1.0.0', '1.0.1'])
      .it('runs api:clone without visibility', ctx => {
        expect(ctx.stdout).to.contain('as version 1.0.1')
      })

  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/apis/org/name/1.0.0/clone', { version: '1.0.1', private: false })
          .reply(201)
      )
      .stdout()
      .command(['api:clone', 'org/name/1.0.0', '1.0.1', '--visibility', 'public'])
      .it('sends private=false for public visibility', ctx => {
        expect(ctx.stdout).to.contain('as version 1.0.1')
      })
})

describe('failing api:clone', () => {
  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/apis/org/name/1.0.0/clone', { version: '1.0.1' })
          .reply(409, { code: 409, message: 'Version already exists' })
      )
      .stdout()
      .command(['api:clone', 'org/name/1.0.0', '1.0.1'])
      .exit(2)
      .it('handles 409 from api:clone', ctx => {
        expect(ctx.stdout).to.contain('Cloning API')
      })
})

describe('invalid api:clone command', () => {
  test
      .command(['api:clone'])
      .catch(err => {
        expect(err.message).to.contain('Missing 2 required args')
      })
      .it('requires both arguments')

  test
      .command(['api:clone', 'org/name', '1.0.1'])
      .catch(err => {
        expect(err.message).to.contain('Argument must match')
      })
      .it('requires a version in the source identifier')

  test
      .command(['api:clone', 'org/name/1.0.0', 'bad*version'])
      .catch(err => {
        expect(err.message).to.contain('Argument must match NEW_VERSION format')
      })
      .it('rejects an invalid new version')
})
