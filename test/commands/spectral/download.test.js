const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const fs = require('fs')
const unzipper = require('unzipper')

const org = 'org1'
const rulesetName = 'rulesetA'
const rulesetPath = `${org}/${rulesetName}`
const outputDir = 'rules'

describe('invalid spectral:download', () => {
  test
    .stdout()
    .command(['spectral:download'])
    .exit(2)
    .it('runs spectral:download with no ruleset path or directory provided')

  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/standardization', api => api
      .get(`/spectral-rulesets/${rulesetPath}/zip`)
      .reply(404, 'Access Denied')
    )
    .command(['spectral:download', rulesetPath, outputDir])
    .exit(2)
    .it('Access Denied returned when trying to fetch ruleset of not existing or not available organization')

  test
    .stub(config, 'isURLValid', stub => stub.returns(false))
    .command(['spectral:download', rulesetPath, outputDir])
    .catch(ctx =>
      expect(ctx.message).to.equal('Please verify that the configured SwaggerHub URL is correct.')
    )
    .it('invalid SwaggerHub URL provided in the config')
})

describe('valid spectral:download', () => {
  const zipBuffer = Buffer.from('PK\x03\x04', 'binary')

  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/standardization', api => api
      .get(`/spectral-rulesets/${rulesetPath}/zip`)
      .reply(200, zipBuffer, { 'Content-Type': 'application/zip' })
    )
    .stub(fs.promises, 'mkdir', stub => stub.resolves())
    .stub(unzipper.Open, 'buffer', stub => stub.resolves({ extract: ({ path }) => Promise.resolve() }))
    .command(['spectral:download', rulesetPath, outputDir])
    .it('runs spectral:download and extracts ruleset zip to directory', ctx => {
      expect(ctx.stdout).to.be.undefined
    })


  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/standardization', api => api
      .get(`/spectral-rulesets/${rulesetPath}/zip`)
      .reply(200, zipBuffer, { 'Content-Type': 'application/zip' })
    )
    .stub(fs.promises, 'mkdir', stub => stub.rejects({ code: 'EEXIST' }))
    .command(['spectral:download', rulesetPath, outputDir])
    .catch(ctx =>
      expect(ctx.message).to.include(`Directory already exists: \'${outputDir}\'`)
    )
    .it('throws error if output directory already exists')

  test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/standardization', api => api
      .get(`/spectral-rulesets/${rulesetPath}/zip`)
      .reply(200, zipBuffer, { 'Content-Type': 'application/zip' })
    )
    .stub(fs.promises, 'mkdir', stub => stub.rejects({ code: 'UNEXPECTED_ERROR', message: 'Custom error' }))
    .command(['spectral:download', rulesetPath, outputDir])
    .catch(ctx =>
      expect(ctx.message).to.include(`Custom error`)
    )
    .it('throws unexpected error')

    test
    .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .nock('https://api.swaggerhub.com/standardization', api => api
      .get(`/spectral-rulesets/${rulesetPath}/zip`)
      .reply(200, zipBuffer, { 'Content-Type': 'application/zip' })
    )
    .stub(fs.promises, 'mkdir', stub => stub.rejects({ code: 'UNEXPECTED_ERROR' }))
    .command(['spectral:download', rulesetPath, outputDir])
    .catch(ctx =>
      expect(ctx.message).to.include(`Unknown Error`)
    )
    .it('throws unexpected error')
})