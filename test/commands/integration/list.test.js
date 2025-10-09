const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const validApi = 'org/api/1.0.0'
const shubUrl = 'https://test.api.swaggerhub.com'
const integrationResponse = {
  'integrations': [
      {
          'id': '12345678-c3d1-41f0-9425-ebdb52c8113c',
          'name': 'GitHub Sync',
          'enabled': true,
          'configType': 'GITHUB'
      },
      {
          'id': 'abcdef00-6925-47b9-be97-1d2ba3ddc69a',
          'name': 'API Automock',
          'enabled': false,
          'configType': 'API_AUTO_MOCKING'
      }
  ]
}

describe('valid integration:list', () => {
  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, { reqheaders: { Accept: 'application/json' } }, integrations => integrations
      .get(`/${validApi}/integrations`)
      .reply(200, integrationResponse)
    )
    .stdout()
    .command(['integration:list', validApi])
    .it('runs integration:list with valid API', ctx => {
      expect(ctx.stdout).to.contain('12345678-c3d1-41f0-9425-ebdb52c8113c  GitHub Sync  GITHUB           true')
      expect(ctx.stdout).to.contain('abcdef00-6925-47b9-be97-1d2ba3ddc69a  API Automock API_AUTO_MOCKING false')
    })

    test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/settings/default')
      .reply(200, { version: '1.0.0' })
    )
    .nock(`${shubUrl}/apis`, { reqheaders: { Accept: 'application/json' } }, integrations => integrations
      .get(`/${validApi}/integrations`)
      .reply(200, integrationResponse)
    )
    .stdout()
    .command(['integration:list', 'org/api'])
    .it('runs integration:list with default API version', ctx => {
      expect(ctx.stdout).to.contain('12345678-c3d1-41f0-9425-ebdb52c8113c  GitHub Sync  GITHUB           true')
      expect(ctx.stdout).to.contain('abcdef00-6925-47b9-be97-1d2ba3ddc69a  API Automock API_AUTO_MOCKING false')
    })
})

describe('invalid integration:list command issues', () => {
  test
    .command(['integration:list'])
    .exit(2)
    .it('runs integration:list with no identifier provided')

  test
    .command(['integration:list', 'owner/api/version/integrationId'])
    .exit(2)
    .it('runs integration:list with integration identifier provided')
})

describe('invalid integration:list', () => {
  test
  .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
  .nock(`${shubUrl}/apis`, integrations => integrations
    .get(`/${validApi}/integrations`)
    .reply(404, { message: 'Unknown API org/api:1.0.0' })
  )
  .command(['integration:list', validApi])
  .catch(ctx =>
    expect(ctx.message).to.equal('Unknown API org/api:1.0.0')
  )
  .it('runs integration:list with an API version that doesn\'t exist')

  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/settings/default')
      .reply(404, { message: 'Unknown API org/api' })
    )
    .command(['integration:list', 'org/api'])
    .catch(ctx =>
      expect(ctx.message).to.equal('Unknown API org/api')
    )
    .it('runs integration:list with an API that doesn\'t exist')
})

