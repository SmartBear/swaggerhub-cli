const { expect, test } = require('@oclif/test')
const { writeJSONSync, deleteFileSync, readJSONSync } = require('../../src/support/fs')
const mock = require('../__mocks__/config')
const isEqual = require('lodash/isEqual')
const { setConfig, getConfig } = require('../../src/services/config')

const envShubUrl = 'https://environmental.var'
const envApiKey = 'api-key-from-env-variable'

describe('config ', () => {
  beforeEach(() => {
    global.configFilePath = mock.configFilePath
    writeJSONSync(mock.configFilePath, mock.config)
  })

  afterEach(() => {
    delete global.configFilePath
    deleteFileSync(mock.configFilePath)
  })

  describe('setConfig', () => {
    test.it('it should update the contents of config file', () => {
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
    test.it('it should return the contents of config file', () => {
      expect(isEqual(getConfig(), mock.config)).to.equal(true)
    })

    test
    .env({ SWAGGERHUB_URL: envShubUrl })
    .it('should return the configured SwaggerHub URL from environmental variable', () => {    
      expect(getConfig().SWAGGERHUB_URL).to.equal(envShubUrl)
    })

    test
    .env({ SWAGGERHUB_URL: envShubUrl })
    .it('should prioritise environmental variable SwaggerHub URL', () => {
      setConfig({ SWAGGERHUB_API_KEY: 'https://file.swaggerhub.com' })
      expect(getConfig().SWAGGERHUB_URL).to.equal(envShubUrl)
    })

    test
    .env({ SWAGGERHUB_API_KEY: envApiKey })
    .it('should return the configured API key from environmental variable', () => {    
        expect(getConfig().SWAGGERHUB_API_KEY).to.equal(envApiKey)
    })

    test
    .env({ SWAGGERHUB_API_KEY: envApiKey })
    .it('should prioritise environmental variable API key', () => {
      setConfig({ SWAGGERHUB_API_KEY: 'abcdef00-file-1234-5678-97e0b583f1b9' })
      expect(getConfig().SWAGGERHUB_API_KEY).to.equal(envApiKey)
    })
  })
})