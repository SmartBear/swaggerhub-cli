const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const shubUrl = 'https://api.swaggerhub.com'

describe('valid domain:clone', () => {
  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/domains/org/name/1.0.0/clone', { version: '1.0.1' })
          .reply(201)
      )
      .stdout()
      .command(['domain:clone', 'org/name/1.0.0', '1.0.1'])
      .it('runs domain:clone without visibility', ctx => {
        expect(ctx.stdout).to.contain('as version 1.0.1')
      })

  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/domains/org/name/1.0.0/clone', { version: '1.0.1', private: false })
          .reply(201)
      )
      .stdout()
      .command(['domain:clone', 'org/name/1.0.0', '1.0.1', '--visibility', 'public'])
      .it('sends private=false for public visibility', ctx => {
        expect(ctx.stdout).to.contain('as version 1.0.1')
      })
})

describe('failing domain:clone', () => {
  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/domains/org/name/1.0.0/clone', { version: '1.0.1' })
          .reply(409, { code: 409, message: 'Version already exists' })
      )
      .stdout()
      .command(['domain:clone', 'org/name/1.0.0', '1.0.1'])
      .exit(2)
      .it('handles 409 from domain:clone', ctx => {
        expect(ctx.stdout).to.contain('Cloning domain')
      })
})

describe('invalid domain:clone command', () => {
  test
      .command(['domain:clone'])
      .catch(err => {
        expect(err.message).to.contain('Missing 2 required args')
      })
      .it('requires both arguments')

  test
      .command(['domain:clone', 'org/name', '1.0.1'])
      .catch(err => {
        expect(err.message).to.contain('Argument must match')
      })
      .it('requires a version in the source identifier')

  test
      .command(['domain:clone', 'org/name/1.0.0', 'bad*version'])
      .catch(err => {
        expect(err.message).to.contain('Argument must match NEW_VERSION format')
      })
      .it('rejects an invalid new version')
})
