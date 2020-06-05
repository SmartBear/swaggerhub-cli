const { CLIError } = require('@oclif/errors')

const identifierRegex = new RegExp(/^[0-9a-zA-Z_\-.]+\/[0-9a-zA-Z_\-.]+(\/[0-9a-zA-Z_\-.]+)?$/)
const requiredVersionRegex = new RegExp(/^[0-9a-zA-Z_\-.]+\/[0-9a-zA-Z_\-.]+\/[0-9a-zA-Z_\-.]+$/)

const validateObjectIdentifier = id => requiredVersionRegex.test(id)

const getIdentifierArg = (args, versionRequired=true) => {
  const identifier = args['OWNER/API_NAME/VERSION']
  if (versionRequired) {
    if (!validateObjectIdentifier(identifier)) {
      throw new CLIError('Argument must match OWNER/API_NAME/VERSION format')
    }
  } else {
    if (!identifierRegex.test(identifier)) {
      throw new CLIError('Argument must match OWNER/API_NAME/[VERSION] format')
    }
  }

  return identifier
}

const reqType = ({ json }) => json ? 'json' : 'yaml'

module.exports = {
  validateObjectIdentifier,
  getIdentifierArg,
  reqType
}
