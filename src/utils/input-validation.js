const { CLIError } = require('@oclif/errors') 

const identifierRegex = new RegExp(/^.+\/.+\/.+$/)

const validateObjectIdentifier = id => identifierRegex.test(id)

const getIdentifierArg = ({ identifier }) => {
  if (!validateObjectIdentifier(identifier)) {
    throw new CLIError('identifier must match {owner}/{api_name}/{version} format')
  }

  return identifier
}

const hasJsonStructure = str => {
  try {
      const result = JSON.parse(str)
      const type = Object.prototype.toString.call(result)
      return type === '[object Object]' 
          || type === '[object Array]'
  } catch (err) {
      return false
  }
}

module.exports = {
    validateObjectIdentifier,
    getIdentifierArg,
    hasJsonStructure
}
