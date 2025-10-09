const { expect, test } = require('@oclif/test')
const inquirer = require('inquirer')
const config = require('../../../src/config')
const apiId = 'org/api'
const apiVersionId = 'org/api/1.0.0'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('valid api:delete', () => {
  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .delete('/org/api/1.0.0')
      .reply(200)
    )
    .stdout()
    .command(['api:delete', apiVersionId])
    .it('runs api:delete on API version', ctx => {
      expect(ctx.stdout).to.contain(`Deleted version 1.0.0 of API '${apiId}'`)
    })

  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
    .stub(inquirer, 'prompt', stub => stub.returns(Promise.resolve({ answer: true })))
    .nock(`${shubUrl}/apis`, api => api
      .delete('/org/api')
      .reply(200)
    )
    .stdout()
    .command(['api:delete', apiId])
    .it('runs api:delete on API defintion', ctx => {
      expect(ctx.stdout).to.contain(`Deleted API '${apiId}'`)
    })

  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
    .stub(inquirer, 'prompt', stub => stub.returns(Promise.resolve({ answer: false })))
    .stdout()
    .command(['api:delete', apiId])
    .it('runs api:delete on API, enter \'No\' on confirmation')

  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .delete('/org/api')
      .reply(200)
    )
    .stdout()
    .command(['api:delete', apiId, '-f'])
    .it('runs api:delete on API defintion with -f flag', ctx => {
      expect(ctx.stdout).to.contain(`Deleted API '${apiId}'`)
    })

  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .delete('/org/api')
      .reply(200)
    )
    .stdout()
    .command(['api:delete', apiId, '--force'])
    .it('runs api:delete on API defintion with --force flag', ctx => {
      expect(ctx.stdout).to.contain(`Deleted API '${apiId}'`)
    })
})

describe('invalid api:delete command issues', () => {
  test
    .command(['api:delete'])
    .exit(2)
    .it('runs api:delete with no identifier provided')

  test
    .command(['api:delete', 'owner'])
    .exit(2)
    .it('runs api:delete with only org identifier provided')
})


describe('api:delete error responses', () => {
  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .delete('/org/api')
      .reply(404, `{ "code": 404, "message": "Unknown API ${apiId}"}`)
    )
    .command(['api:delete', apiId, '-f'])
    .catch(ctx => {
      expect(ctx.message).to.contain(`Unknown API ${apiId}`)
    })
    .it('runs api:delete with API that does not exist')
})
