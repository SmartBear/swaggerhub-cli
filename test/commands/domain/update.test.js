const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const validIdentifier = 'org/domain/1.0.0'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('invalid domain:update command issues', () => {
  test
    .command(['domain:update'])
    .exit(2)
    .it('runs domain:update with no identifier provided')

  test
    .command(['domain:update', 'invalid'])
    .catch(err => {
      expect(err.message).to.contains('No updates specified')
    })
    .it('runs domain:update with no required --file flag')

  test
    .command(['domain:update', 'org/domain', '-f=test/resources/valid_domain.json', '--visibility'])
    .catch(err => {
      expect(err.message).to.equal('Flag --visibility expects a value')
    })
    .it('runs domain:update with no required --visibility flag')

  test
    .command(['domain:update', 'org/domain', '-f=test/resources/valid_domain.json', '--visibility=unexpected'])
    .catch(err => {
      expect(err.message).to.equal('Expected --visibility=unexpected to be one of: public, private\n' +
        'See more help with --help')
    })
    .it('runs domain:update with unexpected value for required --visibility flag')

  test
    .command(['domain:update', 'org/domain', '-f=test/resources/valid_domain.json', '--published=unexpected'])
    .catch(err => {
      expect(err.message).to.equal('Expected --published=unexpected to be one of: publish, unpublish\n' +
        'See more help with --help')
    })
    .it('runs domain:update with unexpected value for required --published flag')

  test
    .command(['domain:update', 'owner', '-f=test/resources/valid_domain.yaml'])
    .exit(2)
    .it('runs domain:update with org identifier provided')
})

describe('invalid domain:update file issues', () => {
  test
    .command(['domain:update', `${validIdentifier}`, '-f=test/resources/missing_file.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('File \'test/resources/missing_file.yaml\' not found')
    })
    .it('runs domain:update with file not found')

  test
    .command(['domain:update', `${validIdentifier}`, '--file=test/resources/invalid_format.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('Ensure the definition is valid.')
    })
    .it('runs domain:update with incorrectly formatted file')

  test
    .command(['domain:update', 'org/domain', '--file=test/resources/missing_version.yaml'])
    .catch(ctx => {
      expect(ctx.message).to.contain('Cannot determine version from file')
    })
    .it('runs domain:update with file missing version')
})

describe('invalid domain:update', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.0.0')
      .reply(404, '{"code": 404, "message": "Unknown domain org/domain/1.0.0"}')
    )
    .command(['domain:update', `${validIdentifier}`, '-f=test/resources/valid_domain.yaml'])
    .exit(2)
    .it('runs domain:update with domain version not found')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.0.0')
      .reply(500, '{"code": 500, "message": "Error"}')
    )
    .command(['domain:update', `${validIdentifier}`, '-f=test/resources/valid_domain.yaml'])
    .exit(2)
    .it('runs domain:update with error retrieving domain version')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.0.0')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.0.0')
      .reply(400, '{"code": 400, "error": "Bad Request"}')
    )
    .command(['domain:update', `${validIdentifier}`, '--file=test/resources/valid_domain.json'])
    .exit(2)
    .it('runs domain:update with error on updating domain')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.0.0')
      .reply(404, '{"code": 404, "message": "Unknown domain org/domain/1.0.0"}')
    )
    .command(['domain:update', `${validIdentifier}`, '-f=test/resources/valid_domain.yaml', '--published=publish', '--setdefault'])
    .catch(err => {
      expect(err.message).to.contains('Unknown domain org/domain/1.0.0')
    })
    .it('error shows as update failed and publish and setdefault are not executed')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.0.0')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.0.0')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/1.0.0/settings/lifecycle')
      .reply(500, '{ "code": 500, "message": "An error occurred. Publishing domain failed"}')
    )
    .command(['domain:update', `${validIdentifier}`, '-f=test/resources/valid_domain.yaml', '--setdefault', '--published=publish'])
    .catch(err => {
      expect(err.message).to.contains('An error occurred. Publishing domain failed')
    })
    .it('error shows as publish failed and setdefault is not executed')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.0.0')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.0.0')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/1.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/settings/default', { version: '1.0.0' })
      .reply(500, '{ "code": 500, "message": "An error occurred. Setting default version failed"}')
    )
    .command(['domain:update', `${validIdentifier}`, '-f=test/resources/valid_domain.yaml', '--published=publish', '--setdefault'])
    .catch(err => {
      expect(err.message).to.contains('An error occurred. Setting default version failed')
    })
    .it('error shows as setdefault failed')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))

    .stdout()
    .command(['domain:update', 'org/domain/2.0.0'])

    .catch(err => {
      expect(err.message).to.contains('No updates specified')
    })
    .it('error shows as no flag is provided')
})

describe('valid domain:update', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.0.0')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.0.0')
      .reply(200)
    )
    .stdout()
    .command(['domain:update', `${validIdentifier}`, '-f=test/resources/valid_domain.yaml'])

    .it('runs domain:update with YAML file', ctx => {
      expect(ctx.stdout).to.contains(`Updated domain ${validIdentifier}`)
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.2.3')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.2.3')
      .reply(200)
    )
    .stdout()
    .command(['domain:update', 'org/domain', '-f=test/resources/valid_domain.json'])

    .it('runs domain:update with JSON file, version read from file', ctx => {
      expect(ctx.stdout).to.contains('Updated domain org/domain/1.2.3')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.2.3')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.2.3&isPrivate=false')
      .reply(200)
    )
    .stdout()
    .command(['domain:update', 'org/domain', '-f=test/resources/valid_domain.json', '--visibility=public'])

    .it('runs domain:update to set domain public', ctx => {
      expect(ctx.stdout).to.contains('Updated domain org/domain/1.2.3')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.2.3')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.2.3&isPrivate=true')
      .reply(200)
    )
    .stdout()
    .command(['domain:update', 'org/domain', '-f=test/resources/valid_domain.json', '--visibility=private'])

    .it('runs domain:update to set domain private', ctx => {
      expect(ctx.stdout).to.contains('Updated domain org/domain/1.2.3')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))

    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/settings/default')
      .reply(200, { version: '2.0.0' })
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/2.0.0/settings/private', { private: false })
      .reply(200)
    )
    .stdout()
    .command(['domain:update', 'org/domain', '--visibility=public'])

    .it('runs domain:update to set domain public without a version arg', ctx => {
      expect(ctx.stdout).to.contains('Updated visibility of org/domain/2.0.0 to public')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))

    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/settings/default')
      .reply(200, { version: '2.0.0' })
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/2.0.0/settings/private', { private: true })
      .reply(200)
    )
    .stdout()
    .command(['domain:update', 'org/domain/2.0.0', '--visibility=private'])

    .it('runs domain:update to set domain private', ctx => {
      expect(ctx.stdout).to.contains('Updated visibility of org/domain/2.0.0 to private')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.2.3')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.2.3')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/1.2.3/settings/lifecycle', { published: true })
      .reply(200)
    )
    .stdout()
    .command(['domain:update', 'org/domain', '-f=test/resources/valid_domain.json', '--published=publish'])

    .it('runs domain:update to publish domain', ctx => {
      expect(ctx.stdout).to.contains('Updated domain org/domain/1.2.3')
      expect(ctx.stdout).to.contains('Published domain org/domain/1.2.3')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.2.3')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.2.3')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/1.2.3/settings/lifecycle', { published: false })
      .reply(200)
    )
    .stdout()
    .command(['domain:update', 'org/domain', '-f=test/resources/valid_domain.json', '--published=unpublish'])

    .it('runs domain:update to unpublish domain', ctx => {
      expect(ctx.stdout).to.contains('Updated domain org/domain/1.2.3')
      expect(ctx.stdout).to.contains('Unpublished domain org/domain/1.2.3')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.2.3')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.2.3')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/settings/default', { version: '1.2.3' })
      .reply(200)
    )
    .stdout()
    .command(['domain:update', 'org/domain', '-f=test/resources/valid_domain.json', '--setdefault'])

    .it('runs domain:update to set default version', ctx => {
      expect(ctx.stdout).to.contains('Updated domain org/domain/1.2.3')
      expect(ctx.stdout).to.contains('Default version of org/domain set to 1.2.3')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/settings/default')
      .reply(200, { version: '2.0.0' })
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/2.0.0/settings/private', { private: false })
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/settings/default', { version: '2.0.0' })
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/2.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .stdout()
    .command(['domain:update', 'org/domain/2.0.0', '--visibility=public', '--published=publish', '--setdefault'])

    .it('runs domain:update to set domain public, publish domain, and set the default version', ctx => {
      expect(ctx.stdout).to.contains('Updated visibility of org/domain/2.0.0 to public')
      expect(ctx.stdout).to.contains('Published domain org/domain/2.0.0')
      expect(ctx.stdout).to.contains('Default version of org/domain set to 2.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/settings/default')
      .reply(200, { version: '2.0.0' })
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/2.0.0/settings/private', { private: false })
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/settings/default', { version: '2.0.0' })
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/2.0.0/settings/lifecycle', { published: false })
      .reply(200)
    )
    .stdout()
    .command(['domain:update', 'org/domain/2.0.0', '--visibility=public', '--published=unpublish', '--setdefault'])

    .it('runs domain:update to set domain public, unpublish domain, and set the default version', ctx => {
      expect(ctx.stdout).to.contains('Updated visibility of org/domain/2.0.0 to public')
      expect(ctx.stdout).to.contains('Unpublished domain org/domain/2.0.0')
      expect(ctx.stdout).to.contains('Default version of org/domain set to 2.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.2.3')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.2.3&isPrivate=false')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/settings/default', { version: '1.2.3' })
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/1.2.3/settings/lifecycle', { published: true })
      .reply(200)
    )
    .stdout()
    .command([
      'domain:update',
      'org/domain',
      '-f=test/resources/valid_domain.json',
      '--visibility=public',
      '--published=publish',
      '--setdefault'
    ])

    .it('runs domain:update to set domain public, publish domain, and set the default version with file flag', ctx => {
      expect(ctx.stdout).to.contains('Updated domain org/domain/1.2.3 and visibility is set to public')
      expect(ctx.stdout).to.contains('Published domain org/domain/1.2.3')
      expect(ctx.stdout).to.contains('Default version of org/domain set to 1.2.3')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/1.2.3')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .post('/org/domain?version=1.2.3')
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/1.2.3/settings/lifecycle', { published: true })
      .reply(200)
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/settings/default', { version: '1.2.3' })
      .reply(200)
    )
    .stdout()
    .command([
      'domain:update', 
      'org/domain', 
      '-f=test/resources/valid_domain.json', 
      '--setdefault',
      '--published=publish'
    ])

    .it('runs domain:update to publish domain and set default version', ctx => {
      expect(ctx.stdout).to.contains('Updated domain org/domain/1.2.3')
      expect(ctx.stdout).to.contains('Published domain org/domain/1.2.3')
      expect(ctx.stdout).to.contains('Default version of org/domain set to 1.2.3')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/settings/default')
      .reply(200, { version: '2.0.0' })
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/2.0.0/settings/lifecycle', { published: true })
      .reply(200)
    )
    .stdout()
    .command(['domain:update', 'org/domain/2.0.0', '--published=publish'])

    .it('runs domain:update to publish domain', ctx => {
      expect(ctx.stdout).to.contains('Published domain org/domain/2.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/settings/default')
      .reply(200, { version: '2.0.0' })
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/2.0.0/settings/lifecycle', { published: false })
      .reply(200)
    )
    .stdout()
    .command(['domain:update', 'org/domain/2.0.0', '--published=unpublish'])

    .it('runs domain:update to unpublish domain', ctx => {
      expect(ctx.stdout).to.contains('Unpublished domain org/domain/2.0.0')
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
    .nock(`${shubUrl}/domains`, domain => domain
      .get('/org/domain/settings/default')
      .reply(200, { version: '2.0.0' })
    )
    .nock(`${shubUrl}/domains`, domain => domain
      .put('/org/domain/settings/default', { version: '2.0.0' })
      .reply(200)
    )
    .stdout()
    .command(['domain:update', 'org/domain/2.0.0', '--setdefault'])

    .it('runs domain:update to set default version', ctx => {
      expect(ctx.stdout).to.contains('Default version of org/domain set to 2.0.0')
    })
})
