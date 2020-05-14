const path = require('path')
const { writeJSONSync, fileExistsSync } = require('../support/fs')
const { configDefaults } = require('../../package.json').oclif

const createConfigFile = (filePath, config) => writeJSONSync(filePath, config)

const configFilePath = ({ configDir }) => path.join(configDir, 'config.json')

const initConfig = filePath => (
  !fileExistsSync(filePath) && createConfigFile(filePath, configDefaults)
)

const setConfigFilePath = filePath => global.configFilePath = filePath

module.exports = async ({ config }) => {
  const filePath = configFilePath(config)
  
  setConfigFilePath(filePath)
  initConfig(filePath)
}