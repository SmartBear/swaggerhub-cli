const { expect, test } = require('@oclif/test')
const yaml = require('js-yaml')
const config = require('../../../../src/services/config')

const validIdentifier = 'org1/api2/1.0.0'
const jsonResponse = {
  openapi: '3.0.0',
  info: {
    description: 'This is a sample Petstore server.'
  },
  version: '1.0.0',
  title: 'Swagger Petstore'

}

describe('invalid indentifier on apis:get', () => {
  test
    .stdout()
    .command(['api:version:get'])
    .exit(2)
    .it('runs api:version:get with no indentifier provided')

  test
    .stdout()
    .command(['api:version:get', 'invalid'])
    .exit(2)
    .it('runs api:version:get with invalid indentifier provided')

  test
    .stdout()
    .command(['api:version:get', 'owner/api'])
    .exit(2)
    .it('runs api:version:get with org/api indentifier provided')

})

describe('valid identifier on api:version:get', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com:443/apis', api => api
      .get(`/${validIdentifier}`)
      .reply(200, jsonResponse)
    )
    .stdout()
    .command(['api:version:get', 'org1/api2/1.0.0', '--json'])
    .it('runs api:version:get --json and returns response in json format', ctx => {
      expect(ctx.stdout).to.contains(JSON.stringify(jsonResponse))
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com:443/apis', api => api
      .get(`/${validIdentifier}`)
      .reply(200, jsonResponse)
    )
    .stdout()
    .command(['api:version:get', 'org1/api2/1.0.0', '-j'])
    .it('runs api:version:get -j and returns response in json format', ctx => {
      expect(ctx.stdout).to.contains(JSON.stringify(jsonResponse))
    })

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com:443/apis', api => api
      .get(`/${validIdentifier}`)
      .reply(200, yaml.dump(jsonResponse))
    )
    .stdout()
    .command(['api:version:get', 'org1/api2/1.0.0'])
    .it('runs api:version:get and returns response in yaml format', ctx => {
      expect(ctx.stdout).to.contains(yaml.dump(jsonResponse))
    })
})

describe('swaggerhub errors on api:version:get', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com:443/apis', api => api
      .get(`/${validIdentifier}`)
      .reply(500, { message: 'Internal Server Error'})
    )
    .stdout()
    .command(['api:version:get', 'org1/api2/1.0.0'])
    .exit(2)
    .it('internal server error returned by SwaggerHub, command fails')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com:443/apis', api => api
      .get(`/${validIdentifier}`)
      .reply(404, { message: 'Not found'})
    )
    .stdout()
    .command(['api:version:get', 'org1/api2/1.0.0'])
    .exit(2)
    .it('not found returned by SwaggerHub, command fails')
})
