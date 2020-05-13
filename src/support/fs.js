const fs = require('fs-extra')

const writeJSONSync = (path, json = {}) => fs.outputJsonSync(path, json, { mode: 0o600 })

const readJSONSync = path => fs.readJSONSync(path)

const readFileSync = path => fs.readFileSync(path)

const fileExistsSync = path => fs.existsSync(path)

module.exports = {
  writeJSONSync,
  readJSONSync,
  readFileSync,
  fileExistsSync
}