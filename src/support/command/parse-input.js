const { CLIError } = require('@oclif/errors')
const { hasJsonStructure } = require('../../utils/general')
const { safeLoad } = require('js-yaml')
const { existsSync, readFileSync } = require('fs-extra')

const versionOptionalRegex = new RegExp(/^[\w\-.]+\/[\w\-.]+(\/[\w\-.]+)?$/)
const requiredVersionRegex = new RegExp(/^[\w\-.]+\/[\w\-.]+\/[\w\-.]+$/)

const validateObjectIdentifier = id => requiredVersionRegex.test(id)

const getIdentifierArg = (args, versionRequired=true) => {
  const identifier = versionRequired ? args['OWNER/API_NAME/VERSION'] : args['OWNER/API_NAME/[VERSION]']
  if (versionRequired) {
    if (!validateObjectIdentifier(identifier)) {
      throw new CLIError('Argument must match OWNER/API_NAME/VERSION format')
    }
  } else {
    if (!versionOptionalRegex.test(identifier)) {
      throw new CLIError('Argument must match OWNER/API_NAME/[VERSION] format')
    }
  }

  return identifier
}

const reqType = ({ json }) => json ? 'json' : 'yaml'

const resolvedParam = ({ resolved }) => resolved ? { resolved: true } : null

const getOasVersion = ({ swagger, openapi }) => {
  if (!swagger && !openapi) {
    throw new CLIError('Cannot determine OAS version from file')
  }
  return swagger || openapi
}

const getVersion = (definition, version) => {
  if (!version && !definition.info.version) {
    throw new CLIError('Cannot determine version from file')
  }
  return version || definition.info.version
}

const parseDefinition = fileName => {
  if (!existsSync(fileName)) {
    throw new CLIError(`File '${fileName}' not found`)
  }
  try {
    const file = readFileSync(fileName)
    return hasJsonStructure(file) ? JSON.parse(file) : safeLoad(file) 
  } catch (e) {
    throw new CLIError(`There was a problem with parsing ${fileName}. Ensure the definition is valid. ${e}`)
  }
}

module.exports = {
  getIdentifierArg,
  getOasVersion,
  getVersion,
  parseDefinition,
  reqType,
  resolvedParam,
  validateObjectIdentifier
}
