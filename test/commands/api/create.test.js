const { expect, test } = require('@oclif/test')
const { writeJSONSync, deleteFileSync } = require('../../../src/support/fs')
const mock = require('../../__mocks__/config')
const validIdentifier = 'org/api/1.0.0'

describe('invalid apis:create indentifier', () => {
  test
    .stdout()
    .command(['api:create'])
    .exit(2)
    .it('runs api:create with no indentifier provided')

  test
    .stdout()
    .command(['api:create', 'invalid'])
    .exit(2)
    .it('runs api:create with no required --file flag')

  test
    .stdout()
    .command(['api:create', 'owner/api', '-f test/resources/create_api.yaml'])
    .exit(1)
    .it('runs api:create with org/api indentifier provided')
})

describe('invalid api:create', () => {

  beforeEach(() => {
    global.configFilePath = mock.configFilePath
    writeJSONSync(mock.configFilePath, mock.config)
  })

  afterEach(() => {
    delete global.configFilePath
    deleteFileSync(mock.configFilePath)
  })

  test
    .nock('https://test.swaggerhub.com/apis', api => api
      .get('/org/api')
      .reply(200)
    )
    .stderr()
    .command(['api:create', `${validIdentifier}`, '-f test/resources/create_api.yaml'])
    .exit(1)
    .it('runs api:create with API already exists')
  
  test
    .nock('https://test.swaggerhub.com/apis', api => api
      .get('/org/api')
      .reply(500)
    )
    .command(['api:create', `${validIdentifier}`, '-f test/resources/create_api.yaml'])
    .exit(1)
    .it('runs api:create error retrieving API')

  test
    .nock('https://test.swaggerhub.com:443/apis', api => api
    .get('/org/api')
    .reply(404)
    )
    .nock('https://test.swaggerhub.com/apis', api => api
      .post('/org/api?version=1.0.0&isPrivate=true&oas=3.0.0')
      .reply(400)
    )
    .command(['api:create', `${validIdentifier}`, '--file=test/resources/create_api.yaml'])
    .exit(1)
    .it('runs api:create with error on saving API')
})

describe('valid api:create', () => {

  beforeEach(() => {
    global.configFilePath = mock.configFilePath
    writeJSONSync(mock.configFilePath, mock.config)
  })

  afterEach(() => {
    delete global.configFilePath
    deleteFileSync(mock.configFilePath)
  })

  test
    .nock('https://test.swaggerhub.com/apis', api => api
      .get('/org/api')
      .reply(404)
    )
    .nock('https://test.swaggerhub.com/apis', api => api
      .post('/org/api?version=1.0.0&isPrivate=true&oas=3.0.0')
      .reply(201)
    )
    .stdout()
    .command(['api:create', `${validIdentifier}`, '--file=test/resources/create_api.yaml'])
    .it('runs api:create with default parameters', ctx => {
      expect(ctx.stdout).to.contains('Created API org/api')
    })

    test
    .nock('https://test.swaggerhub.com/apis', api => api
      .get('/org/api')
      .reply(404)
    )
    .nock('https://test.swaggerhub.com/apis', api => api
      .post('/org/api?version=2.0.0&isPrivate=false&oas=2.0')
      .reply(201)
    )
    .stdout()
    .command([
      'api:create', 
      'org/api/2.0.0', 
      '--file=test/resources/create_api.yaml', 
      '--visibility=public', 
      '--oasVersion=2.0'
    ])
    .it('runs api:create with optional parameters', ctx => {
      expect(ctx.stdout).to.contains('Created API org/api')
    })
})