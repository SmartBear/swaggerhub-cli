const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const fs = require('fs')

const org = 'org1'
const rulesetName = 'rulesetA'
const rulesetPath = `${org}/${rulesetName}`
const inputDir = 'rules'

describe('invalid spectral:upload', () => {
  test
    .stdout()
    .command(['spectral:upload'])
    .exit(2)
    .it('runs spectral:upload with no ruleset path or directory provided')

  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/standardization', api => api
      .put(`/spectral-rulesets/${rulesetPath}/zip`)
      .reply(404, 'Access Denied')
    )
    .command(['spectral:upload', rulesetPath, inputDir])
    .exit(2)
    .it('Access Denied returned when trying to upload ruleset to not existing or not available organization')

  test
    .stub(config, 'isURLValid', stub => stub.returns(false))
    .command(['spectral:upload', rulesetPath, inputDir])
    .catch(ctx =>
      expect(ctx.message).to.equal('Please verify that the configured SwaggerHub URL is correct.')
    )
    .it('invalid SwaggerHub URL provided in the config')
})

describe('valid spectral:upload', () => {
  const zipBuffer = Buffer.from('PK\x03\x04', 'binary')

  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/standardization', api => api
      .put(`/spectral-rulesets/${rulesetPath}/zip`)
      .reply(200, '{"success":true}', { 'Content-Type': 'application/json' })
    )
    .stub(fs, 'createReadStream', stub => stub.returns(zipBuffer))
    .command(['spectral:upload', rulesetPath, inputDir])
    .it('runs spectral:upload and uploads zipped ruleset directory', ctx => {
      expect(ctx.stdout).to.be.undefined
    })

  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/standardization', api => api
      .put(`/spectral-rulesets/${rulesetPath}/zip`)
      .reply(500, '{"error":"Internal Server Error"}', { 'Content-Type': 'application/json' })
    )
    .stub(fs, 'createReadStream', stub => stub.returns(zipBuffer))
    .command(['spectral:upload', rulesetPath, inputDir])
    .catch(ctx =>
      expect(ctx.message).to.include('Internal Server Error')
    )
    .it('throws error if server returns error')

  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/standardization', api => api
      .put(`/spectral-rulesets/${rulesetPath}/zip`)
      .reply(400, '{"error":"Bad Request"}', { 'Content-Type': 'application/json' })
    )
    .stub(fs, 'createReadStream', stub => stub.returns(zipBuffer))
    .command(['spectral:upload', rulesetPath, inputDir])
    .catch(ctx =>
      expect(ctx.message).to.include('Bad Request')
    )
    .it('throws error if bad request')
})