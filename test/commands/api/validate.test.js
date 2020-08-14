const config = require('../../../src/config')
const { expect, test } = require('@oclif/test')

const apiPath = 'example-org/example-api/example-ver'

describe('api:validate', () => {
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
  .it('should return validation errors, one per line', ctx => {
    expect(ctx.stdout).to.contains(`${line}:\t${severity}\t${description}`)
  })
})