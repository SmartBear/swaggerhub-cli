const { CLIError } = require('@oclif/errors') 

const identifierRegex = new RegExp(/^.+\/.+\/.+$/)

const validateObjectIdentifier = id => identifierRegex.test(id)

const getIdentifierArg = ({ identifier }) => {
  if (!validateObjectIdentifier(identifier)) {
    throw new CLIError('identifier must match {owner}/{api_name}/{version} format')
  }

  return identifier
}

module.exports = {
    validateObjectIdentifier,
    getIdentifierArg
}
