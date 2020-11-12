const { expect, test } = require('@oclif/test')
const yaml = require('js-yaml')
const config = require('../../../src/config')

const validIdentifier = 'org1/api2/1.0.0'
const jsonResponse = {
  openapi: '3.0.0',
  info: {
    description: 'This is a sample Petstore server.'
  },
  version: '1.0.0',
  title: 'Swagger Petstore'
}

describe('invalid identifier on apis:get', () => {
  test
    .stdout()
    .command(['api:get'])
    .exit(2)
    .it('runs api:get with no identifier provided')

  test
    .stdout()
    .command(['api:get', 'invalid'])
    .exit(2)
    .it('runs api:get with invalid identifier provided')
})

describe('valid identifier on api:get', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
      .get(`/${validIdentifier}`)
      .reply(200, jsonResponse)
    )
    .stdout()
    .command(['api:get', 'org1/api2/1.0.0', '--json'])
    .it('runs api:get --json and returns response in json format', ctx => {
      expect(ctx.stdout).to.contains(JSON.stringify(jsonResponse, null, 2))
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
      .get(`/${validIdentifier}`)
      .reply(200, jsonResponse)
    )
    .stdout()
    .command(['api:get', 'org1/api2/1.0.0', '-j'])
    .it('runs api:get -j and returns response in json format', ctx => {
      expect(ctx.stdout).to.contains(JSON.stringify(jsonResponse, null, 2))
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/yaml' } }, api => api
      .get(`/${validIdentifier}`)
      .reply(200, yaml.dump(jsonResponse))
    )
    .stdout()
    .command(['api:get', 'org1/api2/1.0.0'])
    .it('runs api:get and returns response in yaml format', ctx => {
      expect(ctx.stdout).to.contains(yaml.dump(jsonResponse))
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/apis', api => api
      .get('/org1/api2/settings/default')
      .reply(200, { version: '1.0.0' })
    )
    .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/yaml' } }, api => api
      .get(`/${validIdentifier}`)
      .reply(200, yaml.dump(jsonResponse))
    )
    .stdout()
    .command(['api:get', 'org1/api2'])
    .it('runs api:get to return default API version in yaml format', ctx => {
      expect(ctx.stdout).to.contains(yaml.dump(jsonResponse))
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/apis', api => api
      .get('/org1/api2/settings/default')
      .reply(200, { version: '1.0.0' })
    )
    .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
      .get(`/${validIdentifier}`)
      .reply(200, jsonResponse)
    )
    .stdout()
    .command(['api:get', 'org1/api2', '-j'])
    .it('runs api:get to return default API version in json format', ctx => {
      expect(ctx.stdout).to.contains(JSON.stringify(jsonResponse, null, 2))
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/yaml' } }, api => api
      .get(`/${validIdentifier}?resolved=true`)
      .reply(200, yaml.dump(jsonResponse))
    )
    .stdout()
    .command(['api:get', 'org1/api2/1.0.0', '--resolved'])
    .it('runs api:get --resolved to return resolved API definition in yaml format', ctx => {
      expect(ctx.stdout).to.contains(yaml.dump(jsonResponse))
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/apis', api => api
      .get('/org1/api2/settings/default')
      .reply(200, { version: '1.0.0' })
    )
    .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/yaml' } }, api => api
      .get(`/${validIdentifier}?resolved=true`)
      .reply(200, yaml.dump(jsonResponse))
    )
    .stdout()
    .command(['api:get', 'org1/api2', '-r'])
    .it('run api:get -r and returns resolved default API version', ctx => {
      expect(ctx.stdout).to.contains(yaml.dump(jsonResponse))
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/apis', { reqheaders: { Accept: 'application/json' } }, api => api
      .get(`/${validIdentifier}?resolved=true`)
      .reply(200, jsonResponse)
    )
    .stdout()
    .command(['api:get', 'org1/api2/1.0.0', '-jr'])
    .it('runs api:get -jr to return resolved definition', ctx => {
      expect(ctx.stdout).to.contains(JSON.stringify(jsonResponse, null, 2))
    })
})

describe('swaggerhub errors on api:get', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/apis', api => api
      .get(`/${validIdentifier}`)
      .reply(500, { message: 'Internal Server Error' })
    )
    .command(['api:get', 'org1/api2/1.0.0'])
    .exit(2)
    .it('internal server error returned by SwaggerHub, command fails')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/apis', api => api
      .get(`/${validIdentifier}`)
      .reply(404, { message: 'Not found' })
    )
    .command(['api:get', 'org1/api2/1.0.0'])
    .exit(2)
    .it('not found returned by SwaggerHub, command fails')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/apis', api => api
      .get('/org1/api2/settings/default')
      .reply(404, { message: 'Unknown API org1/api2' })
    )
    .command(['api:get', 'org1/api2'])
    .exit(2)
    .it('not found returned when fetching default version of API')
})
