const deepExtend = require('deep-extend')
const jsonTemplate = require('json-templates')
const { CLIError } = require('@oclif/errors')
const { safeLoad } = require('js-yaml')
const { existsSync, readFileSync } = require('fs-extra')

const pipe = val => (...fns) => (
  fns.reduce((acc, currentFn) => currentFn(acc), val)
)

const wrapTemplates = templates => Object.keys(templates)
  .reduce((obj, key) => ({
  [key]: jsonTemplate(templates[key]),
  ...obj
}), {})

const mergeDeep = (...args) => deepExtend({}, ...args)

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

const parseDefinition = fileName => {
  if (!existsSync(fileName)) {
    throw new CLIError(`File '${fileName}' not found`)
  }
  try {
    const file = readFileSync(fileName)
    return hasJsonStructure(file) ? JSON.parse(file) : safeLoad(file)
  } catch (e) {
    throw new CLIError(`There was a problem with parsing ${fileName}. Ensure the definition is valid. ${e}`)
  }
}

const getOasVersion = definition => {
  if (definition.swagger) {
    return definition.swagger
  } 
  if (definition.openapi) {
    return definition.openapi
  } 
  throw new CLIError('Cannot determine OAS version from file')
}

module.exports = {
  hasJsonStructure,
  mergeDeep,
  parseDefinition,
  getOasVersion,
  wrapTemplates,
  pipe
}