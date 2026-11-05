import fse from 'fs-extra' // We're not using {readSyncJSON, ...} expansion, since we want to mock it.
import { mergeDeep, pick } from '../utils/general.js'

const swaggerhubUrlRegex = new RegExp(/^https?:\/\/api\..*swaggerhub\.com$/)
const environmentalKeys = ['SWAGGERHUB_URL', 'SWAGGERHUB_API_KEY']

const checkEnvOverrides = config => ({
  ...config,
  ...pick(process.env, environmentalKeys)
})

const getConfig = () => {
  const { configFilePath } = global
  return checkEnvOverrides(fse.readJSONSync(configFilePath))
}

const setConfig = update => {
  const { configFilePath } = global
  return fse.writeJSONSync(configFilePath, mergeDeep(fse.readJSONSync(configFilePath), update))
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
  setConfig,
  getConfig,
  isURLValid
}

export default config
export {
  setConfig,
  getConfig,
  isURLValid
}