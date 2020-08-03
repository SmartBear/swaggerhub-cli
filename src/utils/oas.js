const { CLIError } = require('@oclif/errors')
const { hasJsonStructure } = require('./general')
const { safeLoad } = require('js-yaml')
const fse = require('fs-extra')
const { errorMsg } = require('../template-strings')

const getOasVersion = ({ swagger, openapi }) => {
  if (!swagger && !openapi) {
    throw new CLIError(errorMsg.cannotParseOasVersion())
  }
  return swagger || openapi
}

const getVersion = definition => {
  if (!definition.info || !definition.info.version) {
    throw new CLIError(errorMsg.cannotParseVersion())
  }
  return definition.info.version
}

const parseDefinition = fileName => {
  if (!fse.existsSync(fileName)) {
    throw new CLIError(errorMsg.fileNotFound({ fileName }))
  }
  const file = fse.readFileSync(fileName)
  if (file.length === 0) {
    throw new CLIError(errorMsg.fileIsEmpty({ fileName }))
  }
  try {
    return hasJsonStructure(file) ? JSON.parse(file) : safeLoad(file)
  } catch (e) {
    throw new CLIError(errorMsg.cannotParseDefinition({ fileName, e: JSON.stringify(e) }))
  }
}

module.exports = {
  getOasVersion,
  getVersion,
  parseDefinition,
}
