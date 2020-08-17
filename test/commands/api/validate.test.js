const config = require('../../../src/config')
const { expect, test } = require('@oclif/test')

const apiPath = 'example-org/example-api/example-ver'
const heading = 'line \tseverity \tdescription\n\n'

describe('invalid api:validate', () => {
  const severity = 'CRITICAL',
    description = 'sample description',
    line = 10

  test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
  .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
    .get(`/${apiPath}/validation`)
    .reply(200, {
      validation: [
        { line, description, severity }
      ]
      })
  )
  .stdout()
  .command(['api:validate', apiPath]) // swaggerhub api:validate o/a/v
  .exit(1)
  .it('should return validation errors, one per line', ctx => {
    expect(ctx.stdout).to.contains(`${heading}${line}: \t${severity} \t${description}`)
  })

  test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
  .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
    .get(`/${apiPath}/validation`)
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
    .get(`/${apiPath}/validation`)
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
    .get(`/${apiPath}/validation`)
    .reply(403, {
        code: 403,
        message: `user is not an owner or editor of SPEC ${apiPath}`
      })
  )
  .stdout()
  .command(['api:validate', apiPath])
  .exit(2)
  .it('an error is returned when user has no permission to access API')
})

describe('valid api:validation', () => {
  test.stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
  .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
    .get(`/${apiPath}/validation`)
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
})