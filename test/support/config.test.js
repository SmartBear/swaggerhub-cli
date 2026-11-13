import { expect, test } from '@oclif/test'
import fs from 'node:fs'
import * as mock from '../resources/config.js'
import { isEqual } from '../../src/utils/general.js'
import { fileIO, setConfig, getConfig, isURLValid } from '../../src/config/index.js'

const readJSONSync = path => JSON.parse(fs.readFileSync(path, 'utf8'))
const writeJSONSync = (path, data) => fs.writeFileSync(path, JSON.stringify(data))
const removeSync = path => fs.rmSync(path, { force: true })

const envShubUrl = 'https://environmental.var'
const envApiKey = 'api-key-from-env-variable'

const createEmptyConfigFile = () => writeJSONSync(mock.configFilePath, {})
const createConfigFile = () => writeJSONSync(mock.configFilePath, mock.config)
const createConfigFileWithConfig = config => writeJSONSync(mock.configFilePath, config)

describe('config ', () => {
  before(() => global.configFilePath = mock.configFilePath)

  after(() => delete global.configFilePath)

  afterEach(() => {
    removeSync(mock.configFilePath) // Will fail silently if file doesn't exist.
  })

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

    test
      .stub(fileIO, 'readJSON', stub => stub.throws(new Error('Failed to read')))
      .do(setConfig)
      .catch(err => expect(err.message).to.match(/failed to read/i))
      .it('should throw an error if it fails to read the file.')


    test
      .stub(fileIO, 'readJSON', stub => stub.returns({}))
      .stub(fileIO, 'writeJSON', stub => stub.throws(new Error('Failed to write')))
      .do(setConfig)
      .catch(err => expect(err.message).to.match(/failed to write/i))
      .it('should throw an error if it fails to write the file')
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
    .it('should return the configured Swagger URL from environmental variable', () => {
      expect(getConfig().SWAGGERHUB_URL).to.equal(envShubUrl)
    })

    test
    .do(createConfigFile)
    .env({ SWAGGERHUB_URL: envShubUrl })
    .it('should prioritise environmental variable Swagger URL', () => {
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

  describe('trailing slashes in SWAGGERHUB_URL', () => {
    test
    .do(() => createConfigFileWithConfig({ SWAGGERHUB_URL: 'https://myorg.swaggerhub.com/v1/' }))
    .it('should be removed from the configured url', () => {
      expect(getConfig().SWAGGERHUB_URL).to.equal('https://myorg.swaggerhub.com/v1')
    })

    test
    .do(createEmptyConfigFile)
    .env({ SWAGGERHUB_URL: 'https://myorg.swaggerhub.com/v1//' })
    .it('should be removed from the environmental variable url', () => {
      expect(getConfig().SWAGGERHUB_URL).to.equal('https://myorg.swaggerhub.com/v1')
    })

    test
    .do(() => createConfigFileWithConfig({ SWAGGERHUB_URL: 'https://myorg.swaggerhub.com/v1/' }))
    .it('should not make an on-premise url invalid', () => {
      expect(isURLValid()).to.equal(true)
    })
  })

  describe('isURLValid', () => {
    test
    .do(() => createConfigFileWithConfig({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
    .it('it should return true when using saas api url', () => {
      expect(isURLValid()).to.equal(true)
    })

    test
    .do(() => createConfigFileWithConfig({ SWAGGERHUB_URL: 'https://api.test.swaggerhub.com' }))
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

    test
    .do(() => createConfigFileWithConfig({ SWAGGERHUB_URL: 'http://localhost:8088' }))
    .it('it should return true when using Swagger on localhost', () => {
      expect(isURLValid()).to.equal(true)
    })
  })
})
