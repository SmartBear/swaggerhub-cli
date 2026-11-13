import fs from 'node:fs'
import { mergeDeep, pick } from '../utils/general.js'

const swaggerhubUrlRegex = new RegExp(/^https?:\/\/api\..*swaggerhub\.com$/)
const environmentalKeys = ['SWAGGERHUB_URL', 'SWAGGERHUB_API_KEY']

const checkEnvOverrides = config => ({
  ...config,
  ...pick(process.env, environmentalKeys)
})

const stripTrailingSlashes = config => (
  typeof config.SWAGGERHUB_URL === 'string'
    ? { ...config, SWAGGERHUB_URL: config.SWAGGERHUB_URL.replace(/\/+$/, '') }
    : config
)

// A mutable object keeps file access stubbable in tests (ES module namespaces are frozen).
const fileIO = {
  readJSON: filePath => JSON.parse(fs.readFileSync(filePath, 'utf8')),
  writeJSON: (filePath, data) => fs.writeFileSync(filePath, `${JSON.stringify(data)}\n`)
}

const getConfig = () => {
  const { configFilePath } = global
  return stripTrailingSlashes(checkEnvOverrides(fileIO.readJSON(configFilePath)))
}

const setConfig = update => {
  const { configFilePath } = global
  return fileIO.writeJSON(configFilePath, mergeDeep(fileIO.readJSON(configFilePath), update))
}

const isURLValid = () => {
  const { SWAGGERHUB_URL } = getConfig()
  const url = new URL(SWAGGERHUB_URL)
  return swaggerhubUrlRegex.test(SWAGGERHUB_URL) ||
      (!url.hostname.endsWith('api.swaggerhub.com') && url.pathname.endsWith('/v1')) ||
      url.hostname === 'localhost'
}

// A mutable default export keeps these functions stubbable (ES module namespaces are frozen).
const config = {
  fileIO,
  setConfig,
  getConfig,
  isURLValid
}

export default config
export {
  fileIO,
  setConfig,
  getConfig,
  isURLValid
}