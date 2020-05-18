const { expect, test } = require('@oclif/test')
const config = require('../../../src/services/config')
const validIdentifier = 'org/api/1.0.0'
const envShubUrl = 'https://test.swaggerhub.com'

describe('invalid apis:create indentifier', () => {
  test
    .stdout()
    .command(['api:create'])
    .exit(2)
    .it('runs api:create with no indentifier provided')

  test
    .stdout()
    .command(['api:create', 'invalid', '--oas=2'])
    .exit(2)
    .it('runs api:create with no required --file flag')

  test
    .stdout()
    .command(['api:create', 'owner/api', '-f=test/resources/create_api.yaml'])
    .exit(2)
    .it('runs api:create without required --oas flag')

  test
    .stdout()
    .command(['api:create', 'owner/api', '-f=test/resources/create_api.yaml', '--oas=2'])
    .exit(2)
    .it('runs api:create with org/api indentifier provided')
})
 
describe('invalid api:create', () => {

  test
    .stub(config, 'getConfig', () => ({ swaggerHubUrl: envShubUrl }))
    .nock('https://test.swaggerhub.com/apis', api => api
      .get('/org/api')
      .reply(200)
    )
    .command(['api:create', `${validIdentifier}`, '-f=test/resources/create_api.yaml', '--oas=2'])
    .exit(1)
    .it('runs api:create with API already exists')

  test
    .stub(config, 'getConfig', () => ({ swaggerHubUrl: envShubUrl }))
    .nock('https://test.swaggerhub.com/apis', api => api
      .get('/org/api')
      .reply(500)
    )
    .command(['api:create', `${validIdentifier}`, '-f=test/resources/create_api.yaml', '--oas=2'])
    .exit(2)
    .it('runs api:create error retrieving API')

  test
    .stub(config, 'getConfig', () => ({ swaggerHubUrl: envShubUrl }))
    .nock('https://test.swaggerhub.com/apis', api => api
    .get('/org/api')
    .reply(404)
    )
    .nock('https://test.swaggerhub.com/apis', api => api
      .post('/org/api?version=1.0.0&isPrivate=true&oas=2.0')
      .reply(400)
    )
    .command(['api:create', `${validIdentifier}`, '--file=test/resources/create_api.yaml', '--oas=2'])
    .exit(2)
    .it('runs api:create with error on saving API')
})

describe('valid api:create', () => {

  test
    .stub(config, 'getConfig', () => ({ swaggerHubUrl: envShubUrl }))
    .nock('https://test.swaggerhub.com/apis', api => api
      .get('/org/api')
      .reply(404)
    )
    .nock('https://test.swaggerhub.com/apis', api => api
      .post('/org/api?version=1.0.0&isPrivate=true&oas=3.0.0')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .stdout()
    .command(['api:create', `${validIdentifier}`, '--file=test/resources/create_api.yaml', '--oas=3'])
    .it('runs api:create with default parameters', ctx => {
      expect(ctx.stdout).to.contains('Created API org/api')
    })

  test
    .stub(config, 'getConfig', () => ({ swaggerHubUrl: envShubUrl }))
    .nock('https://test.swaggerhub.com/apis', api => api
      .get('/org/api')
      .reply(404)
    )
    .nock('https://test.swaggerhub.com/apis', api => api
      .post('/org/api?version=2.0.0&isPrivate=false&oas=2.0')
      .matchHeader('Content-Type', 'application/json')
      .reply(201)
    )
    .stdout()
    .command([
      'api:create', 
      'org/api/2.0.0', 
      '--file=test/resources/create_api.json', 
      '--visibility=public', 
      '--oas=2'
    ])
    .it('runs api:create with optional parameters', ctx => {
      expect(ctx.stdout).to.contains('Created API org/api')
    })
})
