const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const validIdentifier = 'org/api/1.0.0'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('invalid api:update command issues', () => {
  test
    .command(['api:update'])
    .exit(2)
    .it('runs api:update with no identifier provided')

  test
    .command(['api:update', 'invalid'])
    .catch(err => {
      expect(err.message).to.contains('No updates specified')
    })
    .it('runs api:update with no required --file flag')

  test
    .command(['api:update', 'org/api', '-f=test/resources/valid_api.json', '--visibility'])
    .catch(err => {
      expect(err.message).to.equal('Flag --visibility expects a value')
    })
    .it('runs api:update with no required --visibility flag')

  test
    .command(['api:update', 'org/api', '-f=test/resources/valid_api.json', '--visibility=unexpected'])
    .catch(err => {
      expect(err.message).to.equal('Expected --visibility=unexpected to be one of: public, private\n' +
        'See more help with --help')
    })
    .it('runs api:update with unexpected value for required --visibility flag')

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
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/1.0.0/settings/private')
      .reply(404, '{"code": 404, "message": "Unknown API org/api/1.0.0"}')
    )
    .command(['api:update', `${validIdentifier}`, '-f=test/resources/valid_api.yaml'])
    .exit(2)
    .it('runs api:update with API version not found')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/1.0.0/settings/private')
      .reply(500, '{"code": 500, "message": "Error"}')
    )
    .command(['api:update', `${validIdentifier}`, '-f=test/resources/valid_api.yaml'])
    .exit(2)
    .it('runs api:update with error retrieving API version')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/1.0.0/settings/private')
      .reply(200, { private: true })
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=1.0.0&isPrivate=true')
      .reply(400, '{"code": 400, "error": "Bad Request"}')
    )
    .command(['api:update', `${validIdentifier}`, '--file=test/resources/valid_api.json'])
    .exit(2)
    .it('runs api:update with error on updating API')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/1.0.0/settings/private')
      .reply(404, '{"code": 404, "message": "Unknown API org/api/1.0.0"}')
    )
    .command(['api:update', `${validIdentifier}`, '-f=test/resources/valid_api.yaml', '--publish', '--setdefault'])
    .catch(err => {
      expect(err.message).to.contains('Unknown API org/api/1.0.0')
    })
    .it('error shows as update failed and publish and setdefault are not executed')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/1.0.0/settings/private')
      .reply(200, { private: true })
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=1.0.0&isPrivate=true')
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/1.0.0/settings/lifecycle')
      .reply(500, '{ "code": 500, "message": "An error occurred. Publishing API failed"}')
    )
    .command(['api:update', `${validIdentifier}`, '-f=test/resources/valid_api.yaml', '--setdefault', '--publish'])
    .catch(err => {
      expect(err.message).to.contains('An error occurred. Publishing API failed')
    })
    .it('error shows as publish failed and setdefault is not executed')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/1.0.0/settings/private')
      .reply(200, { private: true })
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=1.0.0&isPrivate=true')
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/1.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/settings/default', { version: '1.0.0' })
      .reply(500, '{ "code": 500, "message": "An error occurred. Setting default version failed"}')
    )
    .command(['api:update', `${validIdentifier}`, '-f=test/resources/valid_api.yaml', '--publish', '--setdefault'])
    .catch(err => {
      expect(err.message).to.contains('An error occurred. Setting default version failed')
    })
    .it('error shows as setdefault failed')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))

    .stdout()
    .command(['api:update', 'org/api/2.0.0'])

    .catch(err => {
      expect(err.message).to.contains('No updates specified')
    })
    .it('error shows as no flag is provided')
})

describe('valid api:update', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/1.0.0/settings/private')
      .reply(200, { private: true })
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=1.0.0&isPrivate=true')
      .reply(200)
    )
    .stdout()
    .command(['api:update', `${validIdentifier}`, '-f=test/resources/valid_api.yaml'])

    .it('runs api:update with YAML file', ctx => {
      expect(ctx.stdout).to.contains(`Updated API ${validIdentifier}`)
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/2.0.0/settings/private')
      .reply(200, { private: true })
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=2.0.0&isPrivate=true')
      .reply(200)
    )
    .stdout()
    .command(['api:update', 'org/api', '-f=test/resources/valid_api.json'])

    .it('runs api:update with JSON file, version read from file', ctx => {
      expect(ctx.stdout).to.contains('Updated API org/api/2.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/2.0.0/settings/private')
      .reply(200, { private: true })
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=2.0.0&isPrivate=false')
      .reply(200)
    )
    .stdout()
    .command(['api:update', 'org/api', '-f=test/resources/valid_api.json', '--visibility=public'])

    .it('runs api:update to set API public', ctx => {
      expect(ctx.stdout).to.contains('Updated API org/api/2.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/2.0.0/settings/private')
      .reply(200, { private: false })
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=2.0.0&isPrivate=true')
      .reply(200)
    )
    .stdout()
    .command(['api:update', 'org/api', '-f=test/resources/valid_api.json', '--visibility=private'])

    .it('runs api:update to set API private', ctx => {
      expect(ctx.stdout).to.contains('Updated API org/api/2.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))

    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/settings/default')
      .reply(200, { version: '2.0.0' })
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/2.0.0/settings/private', { private: false })
      .reply(200)
    )
    .stdout()
    .command(['api:update', 'org/api', '--visibility=public'])

    .it('runs api:update to set API public without a version arg', ctx => {
      expect(ctx.stdout).to.contains('Updated visibility of API org/api/2.0.0 to public')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))

    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/settings/default')
      .reply(200, { version: '2.0.0' })
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/2.0.0/settings/private', { private: false })
      .reply(200)
    )
    .stdout()
    .command(['api:update', 'org/api/2.0.0', '--visibility=public'])

    .it('runs api:update to set API public', ctx => {
      expect(ctx.stdout).to.contains('Updated visibility of API org/api/2.0.0 to public')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/2.0.0/settings/private')
      .reply(200, { private: true })
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=2.0.0&isPrivate=true')
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/2.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .stdout()
    .command(['api:update', 'org/api', '-f=test/resources/valid_api.json', '--publish'])

    .it('runs api:update to publish API', ctx => {
      expect(ctx.stdout).to.contains('Updated API org/api/2.0.0 and visibility is set to private')
      expect(ctx.stdout).to.contains('Published API org/api/2.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/2.0.0/settings/private')
      .reply(200, { private: true })
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=2.0.0&isPrivate=true')
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/settings/default', { version: '2.0.0' })
      .reply(200)
    )
    .stdout()
    .command(['api:update', 'org/api', '-f=test/resources/valid_api.json', '--setdefault'])

    .it('runs api:update to set default version', ctx => {
      expect(ctx.stdout).to.contains('Updated API org/api/2.0.0 and visibility is set to private')
      expect(ctx.stdout).to.contains('Default version of org/api set to 2.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/settings/default')
      .reply(200, { version: '2.0.0' })
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/2.0.0/settings/private', { private: false })
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/settings/default', { version: '2.0.0' })
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/2.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .stdout()
    .command(['api:update', 'org/api/2.0.0', '--visibility=public', '--publish', '--setdefault'])

    .it('runs api:update to set API public, publish API, and set the default version', ctx => {
      expect(ctx.stdout).to.contains('Updated visibility of API org/api/2.0.0 to public')
      expect(ctx.stdout).to.contains('Published API org/api/2.0.0')
      expect(ctx.stdout).to.contains('Default version of org/api set to 2.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/2.0.0/settings/private')
      .reply(200, { private: true })
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=2.0.0&isPrivate=false')
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/settings/default', { version: '2.0.0' })
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/2.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .stdout()
    .command([
      'api:update',
      'org/api',
      '-f=test/resources/valid_api.json',
      '--visibility=public',
      '--publish',
      '--setdefault'
    ])

    .it('runs api:update to set API public, publish API, and set the default version with file flag', ctx => {
      expect(ctx.stdout).to.contains('Updated API org/api/2.0.0')
      expect(ctx.stdout).to.contains('Published API org/api/2.0.0')
      expect(ctx.stdout).to.contains('Default version of org/api set to 2.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/2.0.0/settings/private')
      .reply(200, { private: true })
    )
    .nock(`${shubUrl}/apis`, api => api
      .post('/org/api?version=2.0.0&isPrivate=true')
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/2.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/settings/default', { version: '2.0.0' })
      .reply(200)
    )
    .stdout()
    .command(['api:update', 'org/api', '-f=test/resources/valid_api.json', '--setdefault', '--publish'])

    .it('runs api:update to publish API and set default version', ctx => {
      expect(ctx.stdout).to.contains('Updated API org/api/2.0.0 and visibility is set to private')
      expect(ctx.stdout).to.contains('Published API org/api/2.0.0')
      expect(ctx.stdout).to.contains('Default version of org/api set to 2.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/settings/default')
      .reply(200, { version: '2.0.0' })
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/2.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .stdout()
    .command(['api:update', 'org/api/2.0.0', '--publish'])

    .it('runs api:update to publish API', ctx => {
      expect(ctx.stdout).to.contains('Published API org/api/2.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/apis`, api => api
      .get('/org/api/settings/default')
      .reply(200, { version: '2.0.0' })
    )
    .nock(`${shubUrl}/apis`, api => api
      .put('/org/api/settings/default', { version: '2.0.0' })
      .reply(200)
    )
    .stdout()
    .command(['api:update', 'org/api/2.0.0', '--setdefault'])

    .it('runs api:update to set default version', ctx => {
      expect(ctx.stdout).to.contains('Default version of org/api set to 2.0.0')
    })
})
