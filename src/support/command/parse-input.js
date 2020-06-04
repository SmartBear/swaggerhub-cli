const { CLIError } = require('@oclif/errors')

const identifierRegex = new RegExp(/^.+\/.+\/.+$/)

const validateObjectIdentifier = id => identifierRegex.test(id)

const getIdentifierArg = args => {
  const identifier = args['OWNER/API_NAME/VERSION']
  if (!validateObjectIdentifier(identifier)) {
    throw new CLIError('Argument must match OWNER/API_NAME/VERSION format')
  }

  return identifier
}

const reqType = ({ json }) => json ? 'json' : 'yaml'

module.exports = {
  validateObjectIdentifier,
  getIdentifierArg,
  reqType
}
