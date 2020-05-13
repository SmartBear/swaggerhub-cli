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
    .command(['apis:get'])
    .exit(1)
    .it('runs apis:get with no indentifier provided')

  test
    .stdout()
    .command(['apis:get', 'invalid'])
    .exit(1)
    .it('runs apis:get with invalid indentifier provided')

  test
    .stdout()
    .command(['apis:get', 'owner/api'])
    .exit(1)
    .it('runs apis:get with org/api indentifier provided')

})

describe('valid apis:get', () => {
  test
    .nock('https://api.swaggerhub.com:443/apis', api => api
      .get(`/${validIdentifier}`)
      .reply(200, jsonResponse)
    )
    .stdout()
    .command(['apis:get', 'org1/api2/1.0.0', '--json'])
    .it('runs apis:get --json and returns response in json format', ctx => {
      expect(ctx.stdout).to.contains(JSON.stringify(jsonResponse))
    })

  test
    .nock('https://api.swaggerhub.com:443/apis', api => api
      .get(`/${validIdentifier}`)
      .reply(200, jsonResponse)
    )
    .stdout()
    .command(['apis:get', 'org1/api2/1.0.0', '-j'])
    .it('runs apis:get -j and returns response in json format', ctx => {
      expect(ctx.stdout).to.contains(JSON.stringify(jsonResponse))
    })

  test
    .nock('https://api.swaggerhub.com:443/apis', api => api
      .get(`/${validIdentifier}`)
      .reply(200, yaml.dump(jsonResponse))
    )
    .stdout()
    .command(['apis:get', 'org1/api2/1.0.0'])
    .it('runs apis:get and returns response in yam; format', ctx => {
      expect(ctx.stdout).to.contains(yaml.dump(jsonResponse))
    })
})

