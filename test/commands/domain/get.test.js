const { expect, test } = require('@oclif/test')
const yaml = require('js-yaml')
const config = require('../../../src/config')

const validIdentifier = 'org1/domain2/1.0.0'
const jsonResponse = {
  openapi: '3.0.0',
  info: {
    title: 'Petstore Domain',
    description: 'Components for Petstore.',
    version: '1.0.0'
  }
}

describe('invalid identifier on domain:get', () => {
  test
    .stdout()
    .command(['domain:get'])
    .exit(2)
    .it('runs domain:get with no identifier provided')

  test
    .stdout()
    .command(['domain:get', 'invalid'])
    .exit(2)
    .it('runs domain:get with invalid identifier provided')
})

describe('valid identifier on domain:get', () => {
  test
  .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
  .nock('https://api.swaggerhub.com/domains', { reqheaders: { Accept: 'application/json' } }, domain => domain
    .get(`/${validIdentifier}`)
    .reply(200, jsonResponse)
  )
  .stdout()
  .command(['domain:get', 'org1/domain2/1.0.0', '--json'])
  .it('runs domain:get --json and returns response in json format', ctx => {
    expect(ctx.stdout).to.contains(JSON.stringify(jsonResponse, null, 2))
  })

  test
  .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
  .nock('https://api.swaggerhub.com/domains', { reqheaders: { Accept: 'application/json' } }, domain => domain
    .get(`/${validIdentifier}`)
    .reply(200, jsonResponse)
  )
  .stdout()
  .command(['domain:get', 'org1/domain2/1.0.0', '-j'])
  .it('runs domain:get -j and returns response in json format', ctx => {
    expect(ctx.stdout).to.contains(JSON.stringify(jsonResponse, null, 2))
  })

  test
  .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
  .nock('https://api.swaggerhub.com/domains', { reqheaders: { Accept: 'application/yaml' } }, domain => domain
    .get(`/${validIdentifier}`)
    .reply(200, yaml.dump(jsonResponse))
  )
  .stdout()
  .command(['domain:get', 'org1/domain2/1.0.0'])
  .it('runs domain:get and returns response in yaml format', ctx => {
    expect(ctx.stdout).to.contains(yaml.dump(jsonResponse))
  })

  test
  .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
  .nock('https://api.swaggerhub.com/domains', domain => domain
    .get('/org1/domain2/settings/default')
    .reply(200, { version: '1.0.0' })
  )
  .nock('https://api.swaggerhub.com/domains', { reqheaders: { Accept: 'application/yaml' } }, domain => domain
    .get(`/${validIdentifier}`)
    .reply(200, yaml.dump(jsonResponse))
  )
  .stdout()
  .command(['domain:get', 'org1/domain2'])
  .it('runs domain:get to return default domain version in yaml format', ctx => {
    expect(ctx.stdout).to.contains(yaml.dump(jsonResponse))
  })

  test
  .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
  .nock('https://api.swaggerhub.com/domains', domain => domain
    .get('/org1/domain2/settings/default')
    .reply(200, { version: '1.0.0' })
  )
  .nock('https://api.swaggerhub.com/domains', { reqheaders: { Accept: 'application/json' } }, domain => domain
    .get(`/${validIdentifier}`)
    .reply(200, jsonResponse)
  )
  .stdout()
  .command(['domain:get', 'org1/domain2', '-j'])
  .it('runs domain:get to return default domain version in json format', ctx => {
    expect(ctx.stdout).to.contains(JSON.stringify(jsonResponse, null, 2))
  })
})

describe('swaggerhub errors on domain:get', () => {
  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/domains', domain => domain
      .get(`/${validIdentifier}`)
      .reply(500, { message: 'Internal Server Error' })
    )
    .command(['domain:get', 'org1/domain2/1.0.0'])
    .exit(2)
    .it('internal server error returned by SwaggerHub, command fails')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/domains', domain => domain
      .get(`/${validIdentifier}`)
      .reply(404, { message: 'Not found' })
    )
    .command(['domain:get', 'org1/domain2/1.0.0'])
    .exit(2)
    .it('not found returned by SwaggerHub, command fails')

  test
    .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/domains', domain => domain
      .get(`/${validIdentifier}`)
      .reply(403, { message: 'Error: This private API is blocked because you have exceeded your current ' +
        'plan\'s limits' })
    )
    .command(['domain:get', 'org1/domain2/1.0.0'])
    .catch(ctx => {
      expect(ctx.message).to.equal('Error: This private API is blocked because you have exceeded your current ' +
        'plan\'s limits')
    })
    .it('not found returned by SwaggerHub, command fails')

  test
  .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
  .nock('https://api.swaggerhub.com/domains', domain => domain
    .get('/org1/domain2/settings/default')
    .reply(404, { message: 'Unknown domain org1/domain2' })
  )
  .command(['domain:get', 'org1/domain2'])
  .exit(2)
  .it('not found returned when fetching default version of domain')
})
