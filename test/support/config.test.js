const { expect, test } = require('@oclif/test')
const { readJSONSync, unlinkSync, writeJSONSync } = require('fs-extra')
const mock = require('../resources/config')
const isEqual = require('lodash/isEqual')
const { setConfig, getConfig, isURLValid } = require('../../src/config')

const envShubUrl = 'https://environmental.var'
const envApiKey = 'api-key-from-env-variable'

const createEmptyConfigFile = () => writeJSONSync(mock.configFilePath, {})
const createConfigFile = () => writeJSONSync(mock.configFilePath, mock.config)
const createConfigFileWithConfig = config => writeJSONSync(mock.configFilePath, config)

describe('config ', () => {
  before(() => global.configFilePath = mock.configFilePath)
  after(() => delete global.configFilePath)
  afterEach(() => unlinkSync(mock.configFilePath))

  describe('setConfig', () => {
    test
    .do(createConfigFile)
    .it('it should update the contents of config file', () => {
      const mockUpdate = {
        ...readJSONSync(mock.configFilePath),
        SWAGGERHUB_URL: 'http://update.test'
      }
      setConfig({ SWAGGERHUB_URL: mockUpdate.SWAGGERHUB_URL })

      expect(isEqual(readJSONSync(mock.configFilePath), mockUpdate))
        .to.equal(true)
    })
  })

  describe('getConfig', () => {
    test
    .do(createConfigFile)
    .it('it should return the contents of config file', () => {
      expect(isEqual(getConfig(), mock.config)).to.equal(true)
    })

    test
    .do(createEmptyConfigFile)
    .env({ SWAGGERHUB_URL: envShubUrl })
    .it('should return the configured SwaggerHub URL from environmental variable', () => {
      expect(getConfig().SWAGGERHUB_URL).to.equal(envShubUrl)
    })

    test
    .do(createConfigFile)
    .env({ SWAGGERHUB_URL: envShubUrl })
    .it('should prioritise environmental variable SwaggerHub URL', () => {
      setConfig({ SWAGGERHUB_API_KEY: 'https://file.swaggerhub.com' })
      expect(getConfig().SWAGGERHUB_URL).to.equal(envShubUrl)
    })

    test
    .do(createEmptyConfigFile)
    .env({ SWAGGERHUB_API_KEY: envApiKey })
    .it('should return the configured API key from environmental variable', () => {
        expect(getConfig().SWAGGERHUB_API_KEY).to.equal(envApiKey)
    })

    test
    .do(createConfigFile)
    .env({ SWAGGERHUB_API_KEY: envApiKey })
    .it('should prioritise environmental variable API key', () => {
      setConfig({ SWAGGERHUB_API_KEY: 'abcdef00-file-1234-5678-97e0b583f1b9' })
      expect(getConfig().SWAGGERHUB_API_KEY).to.equal(envApiKey)
    })
  })

  describe('isURLValid', () => {
    test
    .do(() => createConfigFileWithConfig({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .it('it should return true when using saas api url', () => {
      expect(isURLValid()).to.equal(true)
    })

    test
    .do(() => createConfigFileWithConfig({ SWAGGERHUB_URL: 'https://test-api.swaggerhub.com' }))
    .it('it should return true when using lower envs api url', () => {
      expect(isURLValid()).to.equal(true)
    })

    test
    .do(() => createConfigFileWithConfig({ SWAGGERHUB_URL: 'http://api.swaggerhub.com' }))
    .it('it should return true when using http', () => {
      expect(isURLValid()).to.equal(true)
    })

    test
    .do(() => createConfigFileWithConfig({ SWAGGERHUB_URL: 'http://api.swaggerhub.com/apis' }))
    .it('it should return false when incorrect saas url', () => {
      expect(isURLValid()).to.equal(false)
    })

    test
    .do(() => createConfigFileWithConfig({ SWAGGERHUB_URL: 'http://api.swaggerhub.com/v1' }))
    .it('it should return false when using saas with /v1 path', () => {
      expect(isURLValid()).to.equal(false)
    })

    test
    .do(() => createConfigFileWithConfig({ SWAGGERHUB_URL: 'http://myorg.swaggerhub.com/v1' }))
    .it('it should return true when using on-premise with /v1 path', () => {
      expect(isURLValid()).to.equal(true)
    })
  })
  
})
