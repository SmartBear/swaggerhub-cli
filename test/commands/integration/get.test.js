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

describe('valid integration:get', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, { reqheaders: { Accept: 'application/json' } }, integration => integration
      .get(`/${validPath}`)
      .reply(200, integrationResponse)
    )
    .stdout()
    .command(['integration:get', `${validApi}/integration-id`])
    .it('runs integration:get with valid integration', ctx => {
      expect(ctx.stdout).to.contains(JSON.stringify(integrationResponse, null, 2))
    })
})

describe('invalid integration:get command issues', () => {
  test
    .command(['integration:get'])
    .exit(2)
    .it('runs integration:get with no identifier provided')

  test
    .command(['integration:get', 'owner/api/version'])
    .exit(2)
    .it('runs integration:get with api version identifier provided')
})

describe('invalid integration:get', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, integration => integration
      .get(`/${validPath}`)
      .reply(404, { message: 'The specified API or integration ID was not found' })
    )
    .command(['integration:get', `${validApi}/integration-id`])
    .catch(ctx => {
      expect(ctx.message).to.equal('The specified API or integration ID was not found')
    })
    .it('runs integration:get with an integration that doesn\'t exist')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, integration => integration
      .get(`/${validPath}`)
      .reply(404, { message: 'Unknown API org/api:1.0.0' })
    )
    .command(['integration:get', `${validApi}/integration-id`])
    .catch(ctx => {
      expect(ctx.message).to.equal('Unknown API org/api:1.0.0')
    })
    .it('runs integration:get with an API that doesn\'t exist')
})
