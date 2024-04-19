const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const validApi = 'org/api/1.0.0'
const validPath = 'org/api/1.0.0/integrations/integration-id'
const shubUrl = 'https://test-api.swaggerhub.com'
const integrationResponse = {
    id: 'integration-id',
    name: 'Api Auto Mocking Integration',
    configType: 'API_AUTO_MOCKING',
    enabled: true,
    defaultResponseType: 'application/json',
    modify: true
  }

describe('valid integration:delete', () => {
  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, integration => integration
      .delete(`/${validPath}`)
      .reply(200, 'ok')
    )
    .stdout()
    .command(['integration:delete', `${validApi}/integration-id`])
    .it('runs integration:delete with valid integration', ctx => {
      expect(ctx.stdout).to.contains("Deleted integration 'integration-id' from API 'org/api/1.0.0'")
    })
})

describe('invalid integration:delete command issues', () => {
  test
    .command(['integration:delete'])
    .exit(2)
    .it('runs integration:delete with no identifier provided')

  test
    .command(['integration:delete', 'owner/api/version'])
    .exit(2)
    .it('runs integration:delete without integration identifier provided')
})

describe('invalid integration:delete', () => {
  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, integration => integration
      .delete(`/${validPath}`)
      .reply(404, { message: 'The specified API or integration ID was not found' })
    )
    .command(['integration:delete', `${validApi}/integration-id`])
    .catch(ctx => {
      expect(ctx.message).to.equal('The specified API or integration ID was not found')
    })
    .it('runs integration:delete with an integration that doesn\'t exist')

  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, integration => integration
      .delete(`/${validPath}`)
      .reply(404, { message: 'Unknown API org/api:1.0.0' })
    )
    .command(['integration:delete', `${validApi}/integration-id`])
    .catch(ctx => {
      expect(ctx.message).to.equal('Unknown API org/api:1.0.0')
    })
    .it('runs integration:delete with an API that doesn\'t exist')
})
