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

const getOasVersion = definition => {
  if (definition.swagger) {
    return definition.swagger
  } 
  if (definition.openapi) {
    return definition.openapi
  } 
  throw new CLIError('Cannot determine OAS version from file')
}

const getVersion = (definition, version) => {
  if (!version && definition.info.version) {
    return definition.info.version
  } 
  if (!version && !definition.info.version) {
    throw new CLIError('Cannot determine version from file')
  }
  return version
}

const parseDefinition = (fileName, version) => {
  if (!existsSync(fileName)) {
    throw new CLIError(`File '${fileName}' not found`)
  }
  try {
    const file = readFileSync(fileName)
    const definition = hasJsonStructure(file) ? JSON.parse(file) : safeLoad(file)
    return { definition: definition, oas: getOasVersion(definition), parsedVersion: getVersion(definition, version) }
  } catch (e) {
    throw new CLIError(`There was a problem with parsing ${fileName}. Ensure the definition is valid. ${e}`)
  }
}

module.exports = {
  validateObjectIdentifier,
  getIdentifierArg,
  reqType,
  parseDefinition
}
