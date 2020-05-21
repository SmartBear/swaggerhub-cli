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
