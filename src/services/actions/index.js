const { writeJSONSync } = require('../../support/fs')
const { getConfig } = require('../queries')
const { mergeDeep } = require('../../utils/data-transform')


const setConfig = update => {
  const { configFilePath } = global
  const currentConfig = getConfig()
  return writeJSONSync(configFilePath, mergeDeep(currentConfig, update))
}

module.exports = {
  setConfig
}
