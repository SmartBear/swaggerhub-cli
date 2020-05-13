const { expect, test } = require('@oclif/test')
const yaml = require('yaml-js')

const validIdentifier = 'org1/api2/1.0.0'
const jsonResponse = {
  openapi: '3.0.0',
  info: {
    description: 'This is a sample Petstore server.'
  },
  version: '1.0.0',
  title: 'Swagger Petstore'

}

describe('invalid apis:get', () => {
  test
    .stdout()
    .command(['api:get'])
    .exit(1)
    .it('runs api:get with no indentifier provided')

  test
    .stdout()
    .command(['api:get', 'invalid'])
    .exit(1)
    .it('runs api:get with invalid indentifier provided')

  test
    .stdout()
    .command(['api:get', 'owner/api'])
    .exit(1)
    .it('runs api:get with org/api indentifier provided')

})

describe('valid api:get', () => {
  test
    .nock('https://api.swaggerhub.com:443/apis', api => api
      .get(`/${validIdentifier}`)
      .reply(200, jsonResponse)
    )
    .stdout()
    .command(['api:get', 'org1/api2/1.0.0', '--json'])
    .it('runs api:get --json and returns response in json format', ctx => {
      expect(ctx.stdout).to.contains(JSON.stringify(jsonResponse))
    })

  test
    .nock('https://api.swaggerhub.com:443/apis', api => api
      .get(`/${validIdentifier}`)
      .reply(200, jsonResponse)
    )
    .stdout()
    .command(['api:get', 'org1/api2/1.0.0', '-j'])
    .it('runs api:get -j and returns response in json format', ctx => {
      expect(ctx.stdout).to.contains(JSON.stringify(jsonResponse))
    })

  test
    .nock('https://api.swaggerhub.com:443/apis', api => api
      .get(`/${validIdentifier}`)
      .reply(200, yaml.dump(jsonResponse))
    )
    .stdout()
    .command(['api:get', 'org1/api2/1.0.0'])
    .it('runs api:get and returns response in yaml format', ctx => {
      expect(ctx.stdout).to.contains(yaml.dump(jsonResponse))
    })
})

