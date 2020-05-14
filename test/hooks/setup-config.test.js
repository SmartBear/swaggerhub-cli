const { expect, test } = require('@oclif/test')
const path = require('path')
const { deleteFileSync, fileExistsSync } = require('../../src/support/fs')
const setupConfig = require('../../src/hooks/setup-config')

const mockHookOptions = {
  config: {
    configDir: './'
  }
}

describe('setup config', () => {
  let expectedFilePath
  let configDir

  beforeEach(() => {
    configDir = mockHookOptions.config.configDir
    expectedFilePath = path.join(configDir, 'config.json')
    setupConfig(mockHookOptions)
  })

  afterEach(() => {
    deleteFileSync(global.configFilePath)
    delete global.configFilePath
  })

  describe('setupConfig', () => {
    test.it('it should create a new config file if none exists', () => {
      expect(fileExistsSync(expectedFilePath)).to.equal(true)
    })

    test.it('it should set a global variable - configFilePath', () => {
      expect(global.configFilePath).to.equal(expectedFilePath)
    })
  })
})