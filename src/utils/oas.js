const { CLIError } = require('@oclif/errors')
const { hasJsonStructure } = require('./general')
const yaml = require('js-yaml')
const { existsSync, readFileSync } = require('fs-extra')
const { errorMsg } = require('../template-strings')

const getOasVersion = ({ swagger, openapi }) => {
  if (!swagger && !openapi) {
    throw new CLIError(errorMsg.cannotParseOasVersion())
  }
  return swagger || openapi
}

const getVersion = definition => {
  if (definition.info && definition.info.version) {
    return definition.info.version
  }
  throw new CLIError(errorMsg.cannotParseVersion())
}

const parseDefinition = filename => {
  if (!existsSync(filename)) {
    throw new CLIError(errorMsg.fileNotFound({ filename }))
  }
  const file = readFileSync(filename)
  if (file.length === 0) {
    throw new CLIError(errorMsg.fileIsEmpty({ filename }))
  }
  try {
    return hasJsonStructure(file) ? JSON.parse(file) : yaml.load(file) 
  } catch (e) {
    throw new CLIError(errorMsg.cannotParseDefinition({ filename, e: JSON.stringify(e.message).replace(/\\n/g, '\n') }))
  }
}

module.exports = {
  getOasVersion,
  getVersion,
  parseDefinition,
}