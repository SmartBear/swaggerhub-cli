import path from 'path'
import { existsSync } from 'node:fs'
import fse from 'fs-extra'
const { outputJsonSync } = fse
import packagePkg from '../../package.json' with { type: 'json' }
const { configDefaults } = packagePkg.oclif
import { pipe } from '../utils/general.js'

const createConfigFile = (filePath, config) => outputJsonSync(filePath, config, { mode: 0o600 })

const createConfigPath = ({ configDir }) => path.join(configDir, 'config.json')

const initConfig = filePath => !existsSync(filePath) && createConfigFile(filePath, configDefaults)

const setAsGlobalPath = filePath => global.configFilePath = filePath

const setAsGlobalUserAgent = ({ userAgent, name, ...rest }) => {
  global.shUserAgent = userAgent.replace(name, `${name}-cli`)
  return rest
}

const SetupConfig = async ({ config: defaults }) => (
  pipe(setAsGlobalUserAgent, createConfigPath, setAsGlobalPath, initConfig)(defaults)
)

export default SetupConfig
