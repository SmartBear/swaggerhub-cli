const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const apiIdentifier = 'org/api/1.0.0'
const integrationId = 'integration_id'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('valid integration:update', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, integration => integration
      .put(`/${apiIdentifier}/integrations/${integrationId}`)
      .matchHeader('Content-Type', 'application/json')
      .reply(200)
    )
    .stdout()
    .command(['integration:update', `${apiIdentifier}/${integrationId}`, '--file=test/resources/github.json'])
    .it('runs integration:update with json config file', ctx =>
      expect(ctx.stdout).to.equal(`Updated integration \'${integrationId}\' on API \'${apiIdentifier}\'\n`)
    )
})

describe('invalid integration:update command issues', () => {
  test
    .command(['integration:update'])
    .exit(2)
    .it('runs integration:update with no identifier provided')

  test
    .command(['integration:update', 'owner/api/version/integration'])
    .exit(2)
    .it('runs integration:update with no required --file flag')

  test
    .command(['integration:update', 'owner/api/version', '-f=test/resources/github.json'])
    .exit(2)
    .it('runs integration:update withoout integration identifier provided')

    test
    .command(['integration:update', 'owner/api/verion/integration/integrationId', '-f=test/resources/github.json'])
    .exit(2)
    .it('runs integration:update with to many identifiers provided')
})

describe('invalid integration:update', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, integration => integration
      .put(`/${apiIdentifier}/integrations/${integrationId}`)
      .reply(404, { message: `Integration type GITHUB with ID '${integrationId}' not found` })
    )
    .command(['integration:update', `${apiIdentifier}/${integrationId}`, '--file=test/resources/github.json'])
    .catch(ctx =>
      expect(ctx.message).to.equal(`Integration type GITHUB with ID '${integrationId}' not found`)
    )
    .it('runs integration:update with an API / integration that doesn\'t exist')
})
