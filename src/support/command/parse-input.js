const { CLIError } = require('@oclif/errors')
const { hasJsonStructure } = require('../../utils/general')
const { safeLoad } = require('js-yaml')
const { existsSync, readFileSync } = require('fs-extra')

const versionOptionalRegex = new RegExp(/^[\w\-.]+\/[\w\-.]+(\/[\w\-.]+)?$/)
const requiredVersionRegex = new RegExp(/^[\w\-.]+\/[\w\-.]+\/[\w\-.]+$/)

const validateObjectIdentifier = id => requiredVersionRegex.test(id)

const getIdentifierArg = (versionRequired, format, identifier) => {
  if (versionRequired) {
    if (!validateObjectIdentifier(identifier)) {
      throw new CLIError(`Argument must match ${format} format`)
    }
  } else {
    if (!versionOptionalRegex.test(identifier)) {
      throw new CLIError(`Argument must match ${format} format`)
    }
  }
  return identifier
}

const getApiIdentifierArg = (args, versionRequired = true) => {
  const format = versionRequired ? 'OWNER/API_NAME/VERSION' : 'OWNER/API_NAME/[VERSION]'
  const identifier = args[format]
  return getIdentifierArg(versionRequired, format, identifier)
}

const getDomainIdentifierArg = (args, versionRequired = true) => {
  const format = versionRequired ? 'OWNER/DOMAIN_NAME/VERSION' : 'OWNER/DOMAIN_NAME/[VERSION]'
  const identifier = args[format]
  return getIdentifierArg(versionRequired, format, identifier)
}

const reqType = ({ json }) => json ? 'json' : 'yaml'

const resolvedParam = ({ resolved }) => resolved ? { resolved: true } : null

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
  getApiIdentifierArg,
  getDomainIdentifierArg,
  getOasVersion,
  getVersion,
  parseDefinition,
  reqType,
  resolvedParam,
  validateObjectIdentifier
}
