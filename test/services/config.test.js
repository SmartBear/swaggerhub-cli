const { expect, test } = require('@oclif/test')
const Config = require('../../src/services/config');

const ORIGINAL_API_KEY = Object.assign({}, process.env.SWAGGERHUB_API_KEY);

describe('services', () => {
  describe('config', () => {
    afterEach(() => {
      process.env.SWAGGERHUB_API_KEY = ORIGINAL_API_KEY;
    });

    test.it('should return the configured API key from environmental variable', () => {
      const apiKey = 'abcdef00-0000-1234-5678-97e0b583f1b9';
      process.env.SWAGGERHUB_API_KEY = apiKey;
      
      const config = new Config();
      expect(config.getApiKey()).to.equal(apiKey);
    });

    test.it('should return undefined API key from environmental variable', () => {
      delete process.env.SWAGGERHUB_API_KEY;
      
      const config = new Config();
      expect(config.getApiKey()).to.be.undefined;
    });
  })
})
