const config = require('../../../src/config')
const { expect, test } = require('@oclif/test')

const apiPath = 'example-org/example-api/example-ver'
const heading = 'line \tseverity \tdescription\n\n'

describe('invalid api:validate', () => {

  test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
  .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
    .get(`/${apiPath}/standardization`)
    .reply(404, {
        code: 404,
        message: `SPEC ${apiPath} not found.`
      })
  )
  .stdout()
  .command(['api:validate', apiPath])
  .exit(2)
  .it('not found returned when fetching validation result of a non existing API')

  test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
  .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
    .get(`/${apiPath}/standardization`)
    .reply(404, {
        code: 404,
        message: `Org Standardization not enabled for ${apiPath.split('/')[0]}`
      })
  )
  .stdout()
  .command(['api:validate', apiPath])
  .exit(2)
  .it('not enabled returned when fetching validation result an existing')

  test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
  .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
    .get(`/${apiPath}/standardization`)
    .reply(403, {
        code: 403,
        message: `user is not an owner or editor of SPEC ${apiPath}`
      })
  )
  .stdout()
  .command(['api:validate', apiPath])
  .exit(2)
  .it('an error is returned when user has no permission to access API')

  test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
  .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
    .get(`/${apiPath.substring(0, apiPath.lastIndexOf('/'))}/settings/default`)
    .reply(404, { message: 'Unknown API org1/api2' })
  )
  .command(['api:validate', apiPath.substring(0, apiPath.lastIndexOf('/'))])
  .exit(2)
  .it('not found returned when fetching default version of API')
})

describe('valid api:validate', () => {
  const description = 'sample description'
  const line = 10

  describe('with critical errors present', () => {
    const severity = 'critical'

    describe('without -c flag', () => {
      test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
      .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
        .get(`/${apiPath}/standardization`)
        .reply(200, {
          validation: [
            { line, description, severity }
          ]
          })
      )
      .stdout()
      .command(['api:validate', apiPath]) // swaggerhub api:validate o/a/v
      .exit(0)
      .it('should return validation errors, one per line, with exit code 0', ctx => {
        expect(ctx.stdout).to.contains(`${heading}${line}: \t${severity} \t${description}`)
      })
    })

    describe('with -c flag', () => {
      test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
      .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
        .get(`/${apiPath}/standardization`)
        .reply(200, {
          validation: [
            { line, description, severity }
          ]
          })
      )
      .stdout()
      .command(['api:validate', '-c', apiPath]) // swaggerhub api:validate o/a/v
      .exit(1)
      .it('should return validation errors, one per line, with exit code 1', ctx => {
        expect(ctx.stdout).to.contains(`${heading}${line}: \t${severity} \t${description}`)
      })
    })
    
    describe('with --fail-on-critical flag', () => {
      test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
      .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
        .get(`/${apiPath}/standardization`)
        .reply(200, {
          validation: [
            { line, description, severity }
          ]
          })
      )
      .stdout()
      .command(['api:validate', '--fail-on-critical', apiPath]) // swaggerhub api:validate o/a/v
      .exit(1)
      .it('should return validation errors, one per line, with exit code 1', ctx => {
        expect(ctx.stdout).to.contains(`${heading}${line}: \t${severity} \t${description}`)
      })
    })
  })

  describe('without critical errors present', () => {
    const severity = 'WARNING'

    describe('without -c flag', () => {
      test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
      .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
        .get(`/${apiPath}/standardization`)
        .reply(200, {
          validation: [
            { line, description, severity }
          ]
          })
      )
      .stdout()
      .command(['api:validate', apiPath]) // swaggerhub api:validate o/a/v
      .exit(0)
      .it('should return warning validation errors, one per line, with exit code 0', ctx => {
        expect(ctx.stdout).to.contains(`${heading}${line}: \t${severity} \t${description}`)
      })
    })

    describe('with -c flag', () => {
      test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
      .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
        .get(`/${apiPath}/standardization`)
        .reply(200, {
          validation: [
            { line, description, severity }
          ]
          })
      )
      .stdout()
      .command(['api:validate', '-c', apiPath]) // swaggerhub api:validate o/a/v
      .exit(0)
      .it('should return warning validation errors, one per line, with exit code 0', ctx => {
        expect(ctx.stdout).to.contains(`${heading}${line}: \t${severity} \t${description}`)
      })
    })

    describe('with --fail-on-critical flag', () => {
      test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
      .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
        .get(`/${apiPath}/standardization`)
        .reply(200, {
          validation: [
            { line, description, severity }
          ]
          })
      )
      .stdout()
      .command(['api:validate', '--fail-on-critical', apiPath]) // swaggerhub api:validate o/a/v
      .exit(0)
      .it('should return warning validation errors, one per line, with exit code 0', ctx => {
        expect(ctx.stdout).to.contains(`${heading}${line}: \t${severity} \t${description}`)
      })
    })
  })

  describe('when no standardization errors present', () => {
    test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
      .get(`/${apiPath}/standardization`)
      .reply(200, {
        validation: []
        })
    )
    .stdout()
    .command(['api:validate', apiPath])
    .exit(0)
    .it('should return empty result as there is no error', ctx => {
      expect(ctx.stdout).to.contains('')
    })

    test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/apis', api => api
      .get(`/${apiPath.substring(0, apiPath.lastIndexOf('/'))}/settings/default`)
      .reply(200, { version: apiPath.substring(apiPath.lastIndexOf('/')+1) })
    )
    .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
      .get(`/${apiPath}/standardization`)
      .reply(200, {
        validation: []
      })
    )
    .stdout()
    .command(['api:validate', apiPath.substring(0, apiPath.lastIndexOf('/'))])
    .exit(0)
    .it('should resolve version and return empty result as there is no error', ctx => {
      expect(ctx.stdout).to.contains('')
    })
  })
})