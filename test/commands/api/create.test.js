const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const validIdentifier = 'org/api/1.0.0'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('invalid api:create command issues', () => {
  test
    .command(['api:create'])
    .exit(2)
    .it('runs api:create with no identifier provided')

  test
    .command(['api:create', 'invalid'])
    .exit(2)
    .it('runs api:create with no required --file flag')

  test
    .command(['api:create', 'owner', '-f=test/resources/valid_api.yaml'])
    .exit(2)
    .it('runs api:create with org identifier provided')
})

describe('invalid api:create file issues', () => {
  test
    .command(['api:create', `${validIdentifier}`, '-f=test/resources/missing_file.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('File \'test/resources/missing_file.yaml\' not found')
    })
    .it('runs api:create with file not found')

  test
    .command(['api:create', `${validIdentifier}`, '--file=test/resources/invalid_format.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('Ensure the definition is valid.')
    })
    .it('runs api:create with incorrectly formatted file')

  test
    .command(['api:create', `${validIdentifier}`, '--file=test/resources/missing_oas_version.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('Cannot determine OAS version from file')
    })
    .it('runs api:create with file missing OAS Version')

    test
    .command(['api:create', 'org/api', '--file=test/resources/missing_version.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('Cannot determine version from file')
    })
    .it('runs api:create with file missing version')
})

describe('invalid api:create', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api')
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/1.0.0')
      .reply(200)
    )
    .command(['api:create', `${validIdentifier}`, '-f=test/resources/valid_api.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain(`API version '${validIdentifier}' already exists in SwaggerHub`)
    })
    .it('runs api:create with API version already exists')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api')
      .reply(500, '{ "code": 500, "message": "Error"}')
    )
    .command(['api:create', `${validIdentifier}`, '-f=test/resources/valid_api.yaml'])
    .exit(2)
    .it('runs api:create with error retrieving APIs')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api')
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/1.0.0')
      .reply(500, '{ "code": 500, "message": "Error"}')
    )
    .command(['api:create', `${validIdentifier}`, '--file=test/resources/valid_api.json'])
    .exit(2)
    .it('runs api:create with error on retrieving API version')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/orgNotExist/api')
      .reply(404)
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/orgNotExist/api?version=1.0.0&isPrivate=true&oas=3.0.0')
      .reply(404, '{"code":404,"message":"{\\\"code\\\":404,\\\"message\\\":\\\"Object doesn\'t exist\\\"}"}')
    )
    .command(['api:create', 'orgNotExist/api/1.0.0', '--file=test/resources/valid_api.json'])
    .catch(ctx => {
      expect(ctx.message).to.equal('Object doesn\'t exist')
    })
    .it('runs api:create with org that doesn\'t exist')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/overLimitApi')
      .reply(404)
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/overLimitApi?version=1.0.0&isPrivate=true&oas=3.0.0')
      .reply(403, '{"code":403,"message":"You have reached the limit of APIs"}')
    )
    .command(['api:create', 'org/overLimitApi/1.0.0', '--file=test/resources/valid_api.json'])
    .catch(ctx => {
      expect(ctx.message).to.equal('You have reached the limit of APIs')
    })
    .it('runs api:create with org that doesn\'t exist')
  
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/orgNotExist/api')
      .reply(404)
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/orgNotExist/api?version=1.0.0&isPrivate=true&oas=2.0')
      .reply(404, '{"code":404,"message":"{\\\"code\\\":404,\\\"message\\\":\\\"Object doesn\'t exist\\\"}"}')
    )
    .command(['api:create', 'orgNotExist/api/1.0.0', '-f=test/resources/valid_api.yaml', '--publish', '--setdefault'])
    .catch(err => {
      expect(err.message).to.contains('Object doesn\'t exist')
    })
    .it('error shows as create failed and publish and setdefault are not executed')
  
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api')
      .reply(404)
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=1.0.0&isPrivate=true&oas=2.0')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/1.0.0/settings/lifecycle')
      .reply(500, '{ "code": 500, "message": "An error occurred. Publishing API failed"}')
    )
    .command(['api:create', `${validIdentifier}`, '-f=test/resources/valid_api.yaml', '--setdefault', '--publish'])
    .catch(err => {
      expect(err.message).to.contains('An error occurred. Publishing API failed')
    })
    .it('error shows as publish failed and setdefault is not executed')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api')
      .reply(404)
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=1.0.0&isPrivate=true&oas=2.0')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/1.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/settings/default', { version: '1.0.0' })
      .reply(500, '{ "code": 500, "message": "An error occurred. Setting default version failed"}')
    )
    .command(['api:create', `${validIdentifier}`, '-f=test/resources/valid_api.yaml', '--publish', '--setdefault'])
    .catch(err => {
      expect(err.message).to.contains('An error occurred. Setting default version failed')
    })
    .it('error shows as setdefault failed')
})

describe('valid api:create', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api')
      .reply(404)
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=1.0.0&isPrivate=true&oas=2.0')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .stdout()
    .command(['api:create', `${validIdentifier}`, '--file=test/resources/valid_api.yaml'])
    .it('runs api:create with yaml file', ctx => {
      expect(ctx.stdout).to.contains('Created API \'org/api\'')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api')
      .reply(404)
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=1.0.0&isPrivate=true&oas=2.0')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/settings/default', { version: '1.0.0' })
      .reply(200)
    )
    .stdout()
    .command(['api:create', `${validIdentifier}`, '--file=test/resources/valid_api.yaml', '--setdefault'])
    .it('runs api:create to set default version', ctx => {
      expect(ctx.stdout).to.contains('Created API \'org/api\'\nDefault version of org/api set to 1.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api')
      .reply(404)
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=1.0.0&isPrivate=true&oas=2.0')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/1.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .stdout()
    .command(['api:create', `${validIdentifier}`, '--file=test/resources/valid_api.yaml', '--publish'])
    .it('runs api:create to publish API', ctx => {
      expect(ctx.stdout).to.contains('Created API \'org/api\'\nPublished API org/api/1.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api')
      .reply(404)
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=1.0.0&isPrivate=true&oas=2.0')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/1.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/settings/default', { version: '1.0.0' })
      .reply(200)
    )
    .stdout()
    .command(['api:create', `${validIdentifier}`, '--file=test/resources/valid_api.yaml', '--setdefault', '--publish'])
    .it('runs api:create to publish API and set default version', ctx => {
      expect(ctx.stdout).to
        .contains('Created API \'org/api\'\nPublished API org/api/1.0.0\nDefault version of org/api set to 1.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api')
      .reply(404)
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=2.0.0&isPrivate=false&oas=3.0.0')
      .matchHeader('Content-Type', 'application/json')
      .reply(201)
    )
    .stdout()
    .command([
      'api:create', 
      'org/api/2.0.0', 
      '--file=test/resources/valid_api.json', 
      '--visibility=public'
    ])
    .it('runs api:create with json file', ctx => {
      expect(ctx.stdout).to.contains('Created API \'org/api\'')
    })
})

describe('valid create new version with api:create', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api')
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/1.0.1')
      .reply(404)
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=1.0.1&isPrivate=true&oas=2.0')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .stdout()
    .command(['api:create', 'org/api', '--file=test/resources/valid_api.yaml'])
    .it('runs api:create with yaml file reading version from file', ctx => {
      expect(ctx.stdout).to.contains('Created version 1.0.1 of API \'org/api\'')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api')
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/2.0.0')
      .reply(404)
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=2.0.0&isPrivate=false&oas=3.0.0')
      .reply(201)
    )
    .stdout()
    .command([
      'api:create', 
      'org/api', 
      '--file=test/resources/valid_api.json', 
      '--visibility=public'
    ])
    .it('runs api:create with json file reading version from file', ctx => {
      expect(ctx.stdout).to.contains('Created version 2.0.0 of API \'org/api\'')
    })
})

describe('valid create new version with api:create using invalid swaggerhub url', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: `${shubUrl}/v1` }))
    .stdout()
    .command(['api:create', 'org/api', '--file=test/resources/valid_api.yaml'])
    .exit(2)

})
