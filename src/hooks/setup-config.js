const path = require('path')
const { existsSync, outputJsonSync } = require('fs-extra')
const { configDefaults } = require('../../package.json').oclif
const { pipe } = require('../utils/general')

const createConfigFile = (filePath, config) => outputJsonSync(filePath, config, { mode: 0o600 })

const createConfigPath = ({ configDir }) => path.join(configDir, 'config.json')

const initConfig = filePath => !existsSync(filePath) && createConfigFile(filePath, configDefaults)

const setAsGlobalPath = filePath => global.configFilePath = filePath

const setAsGlobalUserAgent = ({ userAgent, name, ...rest }) => {
  global.shUserAgent = userAgent.replace(name, `${name}-cli`)
  return rest
}

const SetupConfig = async ({ config: defaults }) => (
  pipe(defaults)(setAsGlobalUserAgent, createConfigPath, setAsGlobalPath, initConfig)
)

module.exports = SetupConfig
