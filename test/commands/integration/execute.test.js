const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const validApi = 'org/api/1.0.0'
const validPath = 'org/api/1.0.0/integrations/integration-id'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('valid integration:execute', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, integration => integration
      .post(`/${validPath}/execute`)
      .reply(200, 'ok')
    )
    .stdout()
    .command(['integration:execute', `${validApi}/integration-id`])
    .it('runs integration:execute with valid integration', ctx => {
      expect(ctx.stdout).to.contains('Executed integration on API \'org/api/1.0.0\'')
    })
})

describe('invalid integration:execute command issues', () => {
  test
    .command(['integration:execute'])
    .exit(2)
    .it('runs integration:execute with no identifier provided')

  test
    .command(['integration:execute', 'owner/api/version'])
    .exit(2)
    .it('runs integration:execute without the integration identifier provided')
})

describe('invalid integration:execute', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, integration => integration
      .post(`/${validPath}/execute`)
      .reply(404, { message: 'The specified API or integration ID was not found' })
    )
    .command(['integration:execute', `${validApi}/integration-id`])
    .catch(ctx => {
      expect(ctx.message).to.equal('The specified API or integration ID was not found')
    })
    .it('runs integration:execute with an integration that doesn\'t exist')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, integration => integration
      .post(`/${validPath}/execute`)
      .reply(404, { message: 'Unknown API org/api:1.0.0' })
    )
    .command(['integration:execute', `${validApi}/integration-id`])
    .catch(ctx => {
      expect(ctx.message).to.equal('Unknown API org/api:1.0.0')
    })
    .it('runs integration:execute with an API that doesn\'t exist')
})
