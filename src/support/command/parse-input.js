const { CLIError } = require('@oclif/errors')
const { errorMsg } = require('../../template-strings')

const versionOptionalRegex = new RegExp(/^[\w\-.]+\/[\w\-.]+(\/[\w\-.]+)?$/)
const requiredVersionRegex = new RegExp(/^[\w\-.]+\/[\w\-.]+\/[\w\-.]+$/)

const validateObjectIdentifier = id => requiredVersionRegex.test(id)

const getIdentifierArg = (versionRequired, format, identifier) => {
  if (versionRequired) {
    if (!validateObjectIdentifier(identifier)) {
      throw new CLIError(errorMsg.argsMustMatchFormat({ format }))
    }
  } else {
    if (!versionOptionalRegex.test(identifier)) {
      throw new CLIError(errorMsg.argsMustMatchFormat({ format }))
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

module.exports = {
  getApiIdentifierArg,
  getDomainIdentifierArg,
  reqType,
  resolvedParam,
  validateObjectIdentifier
}
