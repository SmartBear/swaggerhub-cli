const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const validIdentifier = 'org/api/1.0.0'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('valid integration:create', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, integration => integration
      .post(`/${validIdentifier}/integrations`)
      .matchHeader('Content-Type', 'application/json')
      .reply(201)
    )
    .stdout()
    .command(['integration:create', `${validIdentifier}`, '--file=test/resources/github.json'])
    .it('runs integration:create with json config file', ctx => {
      expect(ctx.stdout).to.contains('Created integration on API \'org/api/1.0.0\'')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/settings/default')
      .reply(200, { version: '1.0.0' })
    )
    .nock(`${shubUrl}/apis`, integration => integration
      .post(`/${validIdentifier}/integrations`)
      .matchHeader('Content-Type', 'application/json')
      .reply(201)
    )
    .stdout()
    .command(['integration:create', 'org/api', '--file=test/resources/github.json'])
    .it('runs integration:create on default API version', ctx => {
      expect(ctx.stdout).to.contains('Created integration on API \'org/api/1.0.0\'')
    })
})

describe('invalid integration:create command issues', () => {
  test
    .command(['integration:create'])
    .exit(2)
    .it('runs integration:create with no identifier provided')

  test
    .command(['integration:create', 'invalid'])
    .exit(2)
    .it('runs integration:create with no required --file flag')

  test
    .command(['integration:create', 'owner', '-f=test/resources/github.json'])
    .exit(2)
    .it('runs integration:create with org identifier provided')
})

describe('invalid integration:create file', () => {
  test
    .command(['integration:create', `${validIdentifier}`, '--file=test/resources/missing_file.json'])
    .catch(ctx => {
      expect(ctx.message).to.contain('File \'test/resources/missing_file.json\' not found')
    })
    .it('runs integration:create with missing config file')

  test
    .command(['integration:create', `${validIdentifier}`, '--file=test/resources/empty.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('File \'test/resources/empty.yaml\' is empty')
    })
    .it('runs integration:create with empty config file')

  test
    .command(['integration:create', `${validIdentifier}`, '--file=test/resources/invalid_format.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('Invalid configuration file. Please ensure that the file is in JSON format')
    })
    .it('runs integration:create with non-JSON config file')
})

describe('invalid integration:create', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, integration => integration
      .post(`/${validIdentifier}/integrations`)
      .reply(409, { message: 'Integration \'Integration Name\' already exists' })
    )    
    .command(['integration:create', `${validIdentifier}`, '--file=test/resources/github.json'])
    .catch(ctx => {
      expect(ctx.message).to.contains('Integration \'Integration Name\' already exists')
    })
    .it('runs integration:create with integration name conflict')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, integration => integration
      .post(`/${validIdentifier}/integrations`)
      .reply(404, { message: 'Unknown API org/api/1.0.0' })
    )
    .command(['integration:create', `${validIdentifier}`, '--file=test/resources/github.json'])
    .catch(ctx => {
      expect(ctx.message).to.equal('Unknown API org/api/1.0.0')
    })
    .it('runs integration:create with an API that doesn\'t exist')
})
