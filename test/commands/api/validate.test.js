const config = require('../../../src/config')
const { expect, test } = require('@oclif/test')

const OWNER_API_VER = 'example-org/example-api/example-ver'

describe('api:validate', () => {
  test
  .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))

  // https://app.swaggerhub.com/apis/smartbear/registry-api/1.0.87#/APIs/getDefinitionValidation
  .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
    .get(`/${OWNER_API_VER}/validation`)
    .reply(200, {
      validation: [
        {line: 3, description: 'this is a description', severity: 'CRITICAL'}
      ]
      })
  )
  .stdout()
  .command(['api:validate', OWNER_API_VER]) // swaggerhub api:validate o/a/v
  .it('should return validation errors, one per line', ctx => {
    expect(ctx.stdout).to.contains("3:\tcritical\tthis is a description")
  })
})
