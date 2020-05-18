const fs = require('fs-extra')
const { mergeDeep } = require('../utils/data-transform')

const writeJSONSync = (path, json = {}) => fs.outputJsonSync(path, json, { mode: 0o600 })

const readJSONSync = path => fs.readJSONSync(path)

const fileExistsSync = path => fs.existsSync(path)

const readFileSync = path => fs.readFileSync(path)

const deleteFileSync = path => fs.unlinkSync(path)

const updateJSONSync = (path, update) => writeJSONSync(path, mergeDeep(readJSONSync(path), update))

module.exports = {
  writeJSONSync,
  readJSONSync,
  fileExistsSync,
  readFileSync,
  deleteFileSync,
  updateJSONSync
}