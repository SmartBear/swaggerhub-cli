const { existsSync, readFileSync } = require('fs-extra')
const { hasJsonStructure } = require('../../utils/general')
const { CLIError } = require('@oclif/core').Errors
const { errorMsg } = require('../../template-strings')

const noVersionRegex = new RegExp(/^\/?[\w\-.]+\/[\w\-.]+(\/?)$/)
const optionalVersionRegex = new RegExp(/^\/?[\w\-.]+\/[\w\-.]+(\/[\w\-.]+)?(\/?)$/)
const requiredVersionRegex = new RegExp(/^\/?[\w\-.]+\/[\w\-.]+\/[\w\-.]+(\/?)$/)
const integrationIdentifierRegex = new RegExp(/^\/?[\w\-.]+\/[\w\-.]+\/[\w\-.]+\/[\w\-.]+(\/?)$/)
const projectIdentifierRegex = new RegExp(/^\/?[\w\-.]+\/[\w\-.]+$/)
const spectralIdentifierRegex = new RegExp(/^\/?[\w\-.]+\/[\w\-.]+$/)

const isValidIdentifier = (id, isVersionRequired) => isVersionRequired
  ? requiredVersionRegex.test(id)
  : optionalVersionRegex.test(id)

const getIdentifierArg = (isVersionRequired, format, identifier) => {
  if (!isValidIdentifier(identifier, isVersionRequired)) {
    throw new CLIError(errorMsg.argsMustMatchFormat({ format }))
  }
 
  return identifier
}

const getApiIdentifierArg = args => {
  const isVersionRequired = !!args['OWNER/API_NAME/VERSION']
  const format = isVersionRequired ? 'OWNER/API_NAME/VERSION' : 'OWNER/API_NAME/[VERSION]'
  const identifier = args[format]
  return getIdentifierArg(isVersionRequired, format, identifier)
}

const getDomainIdentifierArg = args => {
  const isVersionRequired = !!args['OWNER/DOMAIN_NAME/VERSION']
  const format = isVersionRequired ? 'OWNER/DOMAIN_NAME/VERSION' : 'OWNER/DOMAIN_NAME/[VERSION]'
  const identifier = args[format]
  return getIdentifierArg(isVersionRequired, format, identifier)
}

const getIntegrationIdentifierArg = args => {
  const format = 'OWNER/API_NAME/VERSION/INTEGRATION_ID'
  const identifier = args[format]
  if (!integrationIdentifierRegex.test(identifier)) {
    throw new CLIError(errorMsg.argsMustMatchFormat({ format }))
  }
  return identifier
}

const getProjectIdentifierArg = args => {
  const format = 'OWNER/PROJECT_NAME'
  const identifier = args[format]
  if (!projectIdentifierRegex.test(identifier)) {
    throw new CLIError(errorMsg.argsMustMatchFormat({ format }))
  }
  return identifier
}

const getSpectralIdentifierArg = args => {
  const format = 'OWNER/RULESET_NAME'
  const identifier = args[format]
  if (!spectralIdentifierRegex.test(identifier)) {
    throw new CLIError(errorMsg.argsMustMatchFormat({ format }))
  }
  return identifier
}

const readConfigFile = filename => {
  if (!existsSync(filename)) {
    throw new CLIError(errorMsg.fileNotFound({ filename }))
  }

  const config = readFileSync(filename)
  if (config.length === 0) {
    throw new CLIError(errorMsg.fileIsEmpty({ filename }))
  }

  if (!hasJsonStructure(config)) {
    throw new CLIError(errorMsg.invalidConfig())
  }
  return config
}

const splitPathParams = path => path.split('/').filter(Boolean)

const splitFlagParams = flag => flag.split(',').map(param => param.trim()).filter(Boolean)

const reqType = ({ json }) => json ? 'json' : 'yaml'

const resolvedParam = ({ resolved }) => resolved ? { resolved: true } : null

module.exports = {
  getApiIdentifierArg,
  getDomainIdentifierArg,
  getIntegrationIdentifierArg,
  getProjectIdentifierArg,
  getSpectralIdentifierArg,
  readConfigFile,
  splitPathParams,
  splitFlagParams,
  reqType,
  resolvedParam,
  isValidIdentifier
}
