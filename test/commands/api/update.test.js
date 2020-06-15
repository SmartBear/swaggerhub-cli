const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const validIdentifier = 'org/api/1.0.0'
const shubUrl = 'https://test.swaggerhub.com'

describe('invalid api:update command issues', () => {
  test
    .command(['api:update'])
    .exit(2)
    .it('runs api:update with no identifier provided')

  test
    .command(['api:update', 'invalid'])
    .exit(2)
    .it('runs api:update with no required --file flag')

  test
    .command(['api:update', 'owner', '-f=test/resources/valid_api.yaml'])
    .exit(2)
    .it('runs api:update with org identifier provided')
})

describe('invalid api:update file issues', () => {
  test
    .command(['api:update', `${validIdentifier}`, '-f=test/resources/missing_file.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('File \'test/resources/missing_file.yaml\' not found')
    })
    .it('runs api:update with file not found')

  test
    .command(['api:update', `${validIdentifier}`, '--file=test/resources/invalid_format.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('Ensure the definition is valid.')
    })
    .it('runs api:update with incorrectly formatted file')

    test
    .command(['api:update', 'org/api', '--file=test/resources/missing_version.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('Cannot determine version from file')
    })
    .it('runs api:update with file missing version')
})

describe('invalid api:update', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock('https://test.swaggerhub.com/apis', api => api
      .get('/org/api/1.0.0')
      .reply(404, '{"code": 404, "message": "Unknown API org/api/1.0.0"}')
    )
    .command(['api:update', `${validIdentifier}`, '-f=test/resources/valid_api.yaml'])
    .exit(2)
    .it('runs api:update with API version not found')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock('https://test.swaggerhub.com/apis', api => api
      .get('/org/api/1.0.0')
      .reply(500, '{"code": 500, "message": "Error"}')
    )
    .command(['api:update', `${validIdentifier}`, '-f=test/resources/valid_api.yaml'])
    .exit(2)
    .it('runs api:update with error retrieving API version')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock('https://test.swaggerhub.com/apis', api => api
      .get('/org/api/1.0.0')
      .reply(200)
    )
    .nock('https://test.swaggerhub.com/apis', api => api
      .post('/org/api?version=1.0.0&isPrivate=true')
      .reply(400, '{"code": 400, "error": "Bad Request"}')
    )
    .command(['api:update', `${validIdentifier}`, '--file=test/resources/valid_api.json'])
    .exit(2)
    .it('runs api:update with error on updating API')
})

describe('valid api:update', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock('https://test.swaggerhub.com/apis', api => api
      .get('/org/api/1.0.0')
      .reply(200)
    )
    .nock('https://test.swaggerhub.com/apis', api => api
      .post('/org/api?version=1.0.0&isPrivate=true')
      .reply(200)
    )
    .stdout()
    .command(['api:update', `${validIdentifier}`, '-f=test/resources/valid_api.yaml'])

    .it('runs api:update with YAML file', ctx => {
      expect(ctx.stdout).to.contains(`Updated API '${validIdentifier}'`)
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock('https://test.swaggerhub.com/apis', api => api
      .get('/org/api/2.0.0')
      .reply(200)
    )
    .nock('https://test.swaggerhub.com/apis', api => api
      .post('/org/api?version=2.0.0&isPrivate=true')
      .reply(200)
    )
    .stdout()
    .command(['api:update', 'org/api', '-f=test/resources/valid_api.json'])

    .it('runs api:update with JSON file, version read from file', ctx => {
      expect(ctx.stdout).to.contains('Updated API \'org/api/2.0.0\'')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock('https://test.swaggerhub.com/apis', api => api
      .get('/org/api/2.0.0')
      .reply(200)
    )
    .nock('https://test.swaggerhub.com/apis', api => api
      .post('/org/api?version=2.0.0&isPrivate=false')
      .reply(200)
    )
    .stdout()
    .command(['api:update', 'org/api', '-f=test/resources/valid_api.json', '--visibility=public'])

    .it('runs api:update to set API public', ctx => {
      expect(ctx.stdout).to.contains('Updated API \'org/api/2.0.0\'')
    })
})
