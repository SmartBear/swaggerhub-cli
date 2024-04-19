const { test, expect } = require('@oclif/test')
const config = require('../../../../src/config')

const orgName = 'example-org'
const apiPath = './test/resources/valid_api.yaml'
const jsonApiPath = './test/resources/valid_api.json'
const heading = ' Line Severity Description        \n ──── ──────── ────────────────── \n'

describe('invalid api:validate:local command issues', () => {
  test
  .command(['api:validate:local'])
  .exit(2)
  .it('runs api:validate:local with no flags provided')

  test
  .command(['api:create', '-f', apiPath])
  .exit(2)
  .it('runs api:create with no required --organization flag')

  test
  .command(['api:create', '-o', orgName])
  .exit(2)
  .it('runs api:create with no required --file flag')
})

describe('invalid api:validate:local file issues', () => {
  test
  .command(['api:validate:local', '-o', orgName, '-f', 'test/resources/missing_file.yaml'])
  .catch(ctx => {
    expect(ctx.message).to.contain('File \'test/resources/missing_file.yaml\' not found')
  })
  .it('runs api:create with file not found')

  test
  .command(['api:validate:local', '-o', orgName, '-f', 'test/resources/invalid_format.yaml'])
  .catch(ctx => {
    expect(ctx.message).to.contain('There was a problem with parsing test/resources/invalid_format.yaml.')
  })
  .it('runs api:create with incorrectly formatted file')

  test
  .command(['api:validate:local', '-o', orgName, '-f', 'test/resources/missing_oas_version.yaml'])
  .catch(ctx => {
    expect(ctx.message).to.contain('Cannot determine specification from file')
  })
  .it('runs api:create with file missing specification')

  test
  .command(['api:validate:local', '-o', orgName, '-f', 'test/resources/missing_version.yaml'])
  .catch(ctx => {
    expect(ctx.message).to.contain('Cannot determine version from file')
  })
  .it('runs api:create with file missing version')
})

describe('valid api:validate:local', () => {
  const description = 'sample description'
  const line = 10

  describe('with critical errors present', () => {
    const severity = 'critical'

    describe('without -c flag', () => {
      test.stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
      .nock('https://api.swaggerhub.com/standardization', api => api
        .post(`/${orgName}/scan`)
        .matchHeader('Content-Type', 'application/yaml')
        .reply(200, {
          validation: [
            { line, description, severity }
          ]
        })
      )
      .stdout()
      .command([
        'api:validate:local', '-o', orgName, '-f', apiPath
      ])
      .exit(0)
      .it('should return validation errors, one per line, with exit code 0', ctx => {
        expect(ctx.stdout).to.contains(`${heading} ${line}   ${severity} ${description}`)
      })
    })

    describe('with -c flag', () => {
      test.stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
      .nock('https://api.swaggerhub.com/standardization', api => api
        .post(`/${orgName}/scan`)
        .reply(200, {
          validation: [
            { line, description, severity }
          ]
        })
      )
      .stdout()
      .command([
        'api:validate:local', '-c', '-o', orgName, '-f', apiPath, '-c'
      ]) // swaggerhub api:validate o/a/v
      .exit(1)
      .it('should return validation errors, one per line, with exit code 1', ctx => {
        expect(ctx.stdout).to.contains(`${heading} ${line}   ${severity} ${description}`)
      })
    })

    describe('with --fail-on-critical flag', () => {
      test.stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
      .nock('https://api.swaggerhub.com/standardization', api => api
        .post(`/${orgName}/scan`)
        .reply(200, {
          validation: [
            { line, description, severity }
          ]
        })
      )
      .stdout()
      .command([
        'api:validate:local', '--fail-on-critical', '-o', orgName, '-f', apiPath, '--fail-on-critical'
      ]) // swaggerhub api:validate o/a/v
      .exit(1)
      .it('should return validation errors, one per line, with exit code 1', ctx => {
        expect(ctx.stdout).to.contains(`${heading} ${line}   ${severity} ${description}`)
      })
    })
  })

  describe('without critical errors present', () => {
    const severity = 'WARNING'

    describe('without -c flag', () => {
      test.stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
      .nock('https://api.swaggerhub.com/standardization', api => api
        .post(`/${orgName}/scan`)
        .reply(200, {
          validation: [
            { line, description, severity }
          ]
        })
      )
      .stdout()
      .command(['api:validate:local', '-o', orgName, '-f', apiPath]) // swaggerhub api:validate o/a/v
      .exit(0)
      .it('should return warning validation errors, one per line, with exit code 0', ctx => {
        expect(ctx.stdout).to.contains(`${heading} ${line}   ${severity}  ${description}`)
      })
    })

    describe('with -c flag', () => {
      test.stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
      .nock('https://api.swaggerhub.com/standardization', api => api
        .post(`/${orgName}/scan`)
        .reply(200, {
          validation: [
            { line, description, severity }
          ]
        })
      )
      .stdout()
      .command(['api:validate:local', '-c', '-o', orgName, '-f', apiPath]) // swaggerhub api:validate o/a/v
      .exit(0)
      .it('should return warning validation errors, one per line, with exit code 0', ctx => {
        expect(ctx.stdout).to.contains(`${heading} ${line}   ${severity}  ${description}`)
      })
    })

    describe('with --fail-on-critical flag', () => {
      test.stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
      .nock('https://api.swaggerhub.com/standardization', api => api
        .post(`/${orgName}/scan`)
        .reply(200, {
          validation: [
            { line, description, severity }
          ]
        })
      )
      .stdout()
      .command([
        'api:validate:local', '--fail-on-critical', '-o', orgName, '-f', apiPath
      ]) // swaggerhub api:validate o/a/v
      .exit(0)
      .it('should return warning validation errors, one per line, with exit code 0', ctx => {
        expect(ctx.stdout).to.contains(`${heading} ${line}   ${severity}  ${description}`)
      })
    })
  })

  describe('when no standardization errors present', () => {
    test.stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/standardization', api => api
      .post(`/${orgName}/scan`)
      .reply(200, {
        validation: []
      })
    )
    .stdout()
    .command(['api:validate:local', '-o', orgName, '-f', apiPath])
    .exit(0)
    .it('should return empty result as there is no error', ctx => {
      expect(ctx.stdout).to.not.contains(heading)
    })
  })

  describe('when sending a JSON file', () => {
    const severity = 'WARNING'

    test.stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/standardization', api => api
      .post(`/${orgName}/scan`)
      .reply(200, {
        validation: [
          { line, description, severity }
        ]
      })
    )
    .stdout()
    .command(['api:validate:local', '-o', orgName, '-f', jsonApiPath])
    .exit(0)
    .it('should return warning validation errors, one per line, with exit code 0', ctx => {
      expect(ctx.stdout).to.contains(`${heading} ${line}   ${severity}  ${description}`)
    })
  })
})