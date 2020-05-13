const { expect, test } = require('@oclif/test')
const { writeJSONSync, deleteFileSync } = require('../../../src/support/fs')
const { getConfig } = require('../../../src/services/queries')

const mock = require('../../__mocks__/config')
const isEqual = require('lodash/isEqual')

describe('config actions', () => {
  describe('getConfig', () => {
    beforeEach(() => {
      global.configFilePath = mock.configFilePath
      writeJSONSync(mock.configFilePath, mock.config)
    })

    afterEach(() => {
      delete global.configFilePath
      deleteFileSync(mock.configFilePath)
    })

    test.it('it should return the contents of config file', () => {
      expect(isEqual(getConfig(), mock.config)).to.equal(true)
    })
  })
})