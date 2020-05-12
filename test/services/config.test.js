const { expect, test } = require('@oclif/test')
const tmp = require('tmp')
const Config = require('../../src/services/config')

const API_KEY = 'abcdef00-0000-1234-5678-97e0b583f1b9'

describe('services', () => {
  describe('config', () => {

    test.it('returns config that was set', () => {
      const shubUrl = 'https://test.swaggerhub.com'
      const apiKey = 'abcdef00-0000-1234-5678-97e0b583f1b9'
      
      const config = new Config('')
      config.swaggerHubUrl = shubUrl
      config.apiKey = apiKey

      expect(config.swaggerHubUrl).to.equal(shubUrl)
      expect(config.apiKey).to.equal(apiKey)
    })

    test.it('should return the default SwaggerHub URL', () => {
      const config = new Config('')
      const defaultSwaggerHubUrl = 'https://app.swaggerhub.com'
      
      expect(config.swaggerHubUrl).to.equal(defaultSwaggerHubUrl)
    })

    test
    .env({ SWAGGERHUB_API_KEY: API_KEY })
    .it('should return the configured API key from environmental variable', () => {      
      const config = new Config('')
      expect(config.apiKey).to.equal(API_KEY)
    })

    test
    .env({ SWAGGERHUB_API_KEY: API_KEY })
    .it('should prioritise environmental variable API key', () => {
      const config = new Config('')
      const fileApiKey = 'abcdef00-file-1234-5678-97e0b583f1b9'
      config.apiKey = fileApiKey
      expect(config.apiKey).to.equal(API_KEY)
      delete process.env.SWAGGERHUB_API_KEY
    })

    test.it('should return API key undefined from environmental variable', () => {
      const config = new Config('')
      expect(config.apiKey).to.be.undefined
    })

    test.it('should return saved config', () => {
      const tempDir = tmp.dirSync({ unsafeCleanup: true })
      const config = new Config(tempDir.name)
      config.load()
      
      const defaultSwaggerHubUrl = 'https://app.swaggerhub.com'
      expect(config.swaggerHubUrl).to.equal(defaultSwaggerHubUrl)
      expect(config.apiKey).to.be.undefined

      const newUrl = 'https://test.swaggerhub.com'
      const newApiKey = 'abcdef00-save-1234-5678-97e0b583f1b9'
      config.swaggerHubUrl = newUrl
      config.apiKey = newApiKey
      config.save()

      const loadConfig = new Config(tempDir.name)
      loadConfig.load()
      expect(loadConfig.swaggerHubUrl).to.equal(newUrl)
      expect(loadConfig.apiKey).to.equal(newApiKey)
    })
  })
})
