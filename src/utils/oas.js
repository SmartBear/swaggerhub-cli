const { CLIError } = require('@oclif/errors')
const { hasJsonStructure } = require('./general')
const { safeLoad } = require('js-yaml')
const { existsSync, readFileSync } = require('fs-extra')

const getOasVersion = ({ swagger, openapi }) => {
  if (!swagger && !openapi) {
    throw new CLIError('Cannot determine OAS version from file')
  }
  return swagger || openapi
}

const getVersion = definition => {
  if (!definition.info || !definition.info.version) {
    throw new CLIError('Cannot determine version from file')
  }
  return definition.info.version
}

const parseDefinition = fileName => {
  if (!existsSync(fileName)) {
    throw new CLIError(`File '${fileName}' not found`)
  }
  const file = readFileSync(fileName)
  if (file.length === 0) {
    throw new CLIError(`File '${fileName}' is empty`)
  }
  try {
    return hasJsonStructure(file) ? JSON.parse(file) : safeLoad(file) 
  } catch (e) {
    throw new CLIError(`There was a problem with parsing ${fileName}. Ensure the definition is valid. ${e}`)
  }
}

module.exports = {
  getOasVersion,
  getVersion,
  parseDefinition,
}