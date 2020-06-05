const { CLIError } = require('@oclif/errors')

const identifierRegex = new RegExp(/^[0-9a-zA-Z_\-.]+\/[0-9a-zA-Z_\-.]+(\/[0-9a-zA-Z_\-.]+)?$/)
const requiredVersionRegex = new RegExp(/^[0-9a-zA-Z_\-.]+\/[0-9a-zA-Z_\-.]+\/[0-9a-zA-Z_\-.]+$/)

const validateObjectIdentifier = id => identifierRegex.test(id)

const getIdentifierArg = (args, versionRequired=false) => {
  const identifier = args['OWNER/API_NAME/VERSION']
  if (versionRequired) {
    if (!requiredVersionRegex.test(identifier)) {
      throw new CLIError('Argument must match OWNER/API_NAME/VERSION format')
    }
  } else {
    if (!validateObjectIdentifier(identifier)) {
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
