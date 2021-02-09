const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const validIdentifier = 'org/domain/1.0.0'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('invalid domain:create command issues', () => {
  test
    .command(['domain:create'])
    .exit(2)
    .it('runs domain:create with no identifier provided')

  test
    .command(['domain:create', 'invalid'])
    .exit(2)
    .it('runs domain:create with no required --file flag')

  test
    .command(['domain:create', 'owner', '-f=test/resources/valid_domain.yaml'])
    .exit(2)
    .it('runs domain:create with org identifier provided')
})

describe('invalid domain:create file issues', () => {
  test
    .command(['domain:create', `${validIdentifier}`, '-f=test/resources/missing_file.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('File \'test/resources/missing_file.yaml\' not found')
    })
    .it('runs domain:create with file not found')

  test
    .command(['domain:create', `${validIdentifier}`, '--file=test/resources/invalid_format.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('Ensure the definition is valid.')
    })
    .it('runs domain:create with incorrectly formatted file')

    test
    .command(['domain:create', 'org/domain', '--file=test/resources/missing_version.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('Cannot determine version from file')
    })
    .it('runs domain:create with file missing version')
})

describe('invalid domain:create', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.0.0')
      .reply(200)
    )
    .command(['domain:create', `${validIdentifier}`, '-f=test/resources/valid_domain.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain(`Domain version '${validIdentifier}' already exists in SwaggerHub`)
    })
    .it('runs domain:create with domain version already exists')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain')
      .reply(500, '{ "code": 500, "message": "Error"}')
    )
    .command(['domain:create', `${validIdentifier}`, '-f=test/resources/valid_domain.yaml'])
    .exit(2)
    .it('runs domain:create with error retrieving domains')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.0.0')
      .reply(500, '{ "code": 500, "message": "Error"}')
    )
    .command(['domain:create', `${validIdentifier}`, '--file=test/resources/valid_domain.json'])
    .exit(2)
    .it('runs domain:create with error on retrieving domain version')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/orgNotExist/domain')
      .reply(404)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/orgNotExist/domain?version=1.0.0&isPrivate=true')
      .reply(404, '{"code":404,"message":"{\\\"code\\\":404,\\\"message\\\":\\\"Object doesn\'t exist\\\"}"}')
    )
    .command(['domain:create', 'orgNotExist/domain/1.0.0', '--file=test/resources/valid_domain.json'])
    .catch(ctx => {
      expect(ctx.message).to.equal('Object doesn\'t exist')
    })
    .it('runs domain:create with org that doesn\'t exist')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/overLimit')
      .reply(404)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/overLimit?version=1.0.0&isPrivate=true')
      .reply(403, '{"code":403,"message":"You have reached the limit of domains"}')
    )
    .command(['domain:create', 'org/overLimit/1.0.0', '--file=test/resources/valid_domain.json'])
    .catch(ctx => {
      expect(ctx.message).to.equal('You have reached the limit of domains')
    })
    .it('runs domain:create with org that doesn\'t exist')
  
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/orgNotExist/domain')
      .reply(404)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/orgNotExist/domain?version=1.0.0&isPrivate=true')
      .reply(404, '{"code":404,"message":"{\\\"code\\\":404,\\\"message\\\":\\\"Object doesn\'t exist\\\"}"}')
    )
    .command(['domain:create', 'orgNotExist/domain/1.0.0', '-f=test/resources/valid_domain.yaml',
      '--publish', '--setdefault'])
    .catch(err => {
      expect(err.message).to.contains('Object doesn\'t exist')
    })
    .it('error shows as create failed and publish and setdefault are not executed')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain')
      .reply(404)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.0.0&isPrivate=true')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/1.0.0/settings/lifecycle')
      .reply(500, '{ "code": 500, "message": "An error occurred. Publishing domain failed"}')
    )
    .command(['domain:create', `${validIdentifier}`, '-f=test/resources/valid_domain.yaml', '--setdefault', '--publish'])
    .catch(err => {
      expect(err.message).to.contains('An error occurred. Publishing domain failed')
    })
    .it('error shows as publish failed and setdefault is not executed')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain')
      .reply(404)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.0.0&isPrivate=true')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/1.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/settings/default', { version: '1.0.0' })
      .reply(500, '{ "code": 500, "message": "An error occurred. Setting default version failed"}')
    )
    .command(['domain:create', `${validIdentifier}`, '-f=test/resources/valid_domain.yaml', '--publish', '--setdefault'])
    .catch(err => {
      expect(err.message).to.contains('An error occurred. Setting default version failed')
    })
    .it('error shows as setdefault failed')
})

describe('valid domain:create', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain')
      .reply(404)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.0.0&isPrivate=true')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .stdout()
    .command(['domain:create', `${validIdentifier}`, '--file=test/resources/valid_domain.yaml'])
    .it('runs domain:create with yaml file', ctx => {
      expect(ctx.stdout).to.contains('Created domain \'org/domain\'')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain')
      .reply(404)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.0.0&isPrivate=true')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/settings/default', { version: '1.0.0' })
      .reply(200)
    )
    .stdout()
    .command(['domain:create', `${validIdentifier}`, '--file=test/resources/valid_domain.yaml', '--setdefault'])
    .it('runs domain:create to set default version', ctx => {
      expect(ctx.stdout).to.contains('Created domain \'org/domain\'\nDefault version of org/domain set to 1.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain')
      .reply(404)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.0.0&isPrivate=true')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/1.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .stdout()
    .command(['domain:create', `${validIdentifier}`, '--file=test/resources/valid_domain.yaml', '--publish'])
    .it('runs domain:create to publish domain', ctx => {
      expect(ctx.stdout).to.contains('Created domain \'org/domain\'\nPublished domain org/domain/1.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain')
      .reply(404)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.0.0&isPrivate=true')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/1.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/settings/default', { version: '1.0.0' })
      .reply(200)
    )
    .stdout()
    .command(['domain:create', `${validIdentifier}`, '--file=test/resources/valid_domain.yaml', '--setdefault', '--publish'])
    .it('runs domain:create to publish domain and set default version', ctx => {
      expect(ctx.stdout).to
        .contains('Created domain \'org/domain\'\n' +
          'Published domain org/domain/1.0.0\n' +
          'Default version of org/domain set to 1.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain')
      .reply(404)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=2.0.0&isPrivate=false')
      .matchHeader('Content-Type', 'application/json')
      .reply(201)
    )
    .stdout()
    .command([
      'domain:create', 
      'org/domain/2.0.0', 
      '--file=test/resources/valid_domain.json', 
      '--visibility=public'
    ])
    .it('runs domain:create with json file', ctx => {
      expect(ctx.stdout).to.contains('Created domain \'org/domain\'')
    })
})

describe('valid create new version with domain:create', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.2.3')
      .reply(404)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.2.3&isPrivate=true')
      .matchHeader('Content-Type', 'application/yaml')
      .reply(201)
    )
    .stdout()
    .command(['domain:create', 'org/domain', '--file=test/resources/valid_domain.yaml'])
    .it('runs domain:create with yaml file reading version from file', ctx => {
      expect(ctx.stdout).to.contains('Created version 1.2.3 of domain \'org/domain\'')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.2.3')
      .reply(404)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.2.3&isPrivate=false')
      .reply(201)
    )
    .stdout()
    .command([
      'domain:create', 
      'org/domain', 
      '--file=test/resources/valid_domain.json', 
      '--visibility=public'
    ])
    .it('runs domain:create with json file reading version from file', ctx => {
      expect(ctx.stdout).to.contains('Created version 1.2.3 of domain \'org/domain\'')
    })
})

describe('valid create new version with domain:create using invalid swaggerhub url', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: `${shubUrl}/v1` }))
    .stdout()
    .command(['domain:create', 'org/domain', '--file=test/resources/valid_domain.yaml'])
    .exit(2)
})
