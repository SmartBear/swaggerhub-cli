const fs = require('fs-extra')

const writeJSONSync = (path, json = {}) => fs.outputJsonSync(path, json, { mode: 0o600 })

const readJSONSync = path => fs.readJSONSync(path)

const fileExistsSync = path => fs.existsSync(path)

const deleteFileSync = path => fs.unlinkSync(path)

module.exports = {
  writeJSONSync,
  readJSONSync,
  fileExistsSync,
  deleteFileSync
}