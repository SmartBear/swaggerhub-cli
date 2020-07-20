const { CLIError } = require('@oclif/errors')
const { errorMsg } = require('../../template-strings')

const optionalVersionRegex = new RegExp(/^\/?[\w\-.]+\/[\w\-.]+(\/[\w\-.]+)?(\/?)$/)
const requiredVersionRegex = new RegExp(/^\/?[\w\-.]+\/[\w\-.]+\/[\w\-.]+(\/?)$/)

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

const splitPathParams = path => path.split('/').filter(Boolean)

const reqType = ({ json }) => json ? 'json' : 'yaml'

const resolvedParam = ({ resolved }) => resolved ? { resolved: true } : null

module.exports = {
  getApiIdentifierArg,
  getDomainIdentifierArg,
  splitPathParams,
  reqType,
  resolvedParam,
  isValidIdentifier
}
