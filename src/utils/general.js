const deepExtend = require('deep-extend')
const jsonTemplate = require('json-templates')

const pipe = val => (...fns) => (
  fns.reduce((acc, currentFn) => currentFn(acc), val)
)

const pipeAsync = (...fns) => val => fns.reduce((chain, func) => chain.then(func), Promise.resolve(val))

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

module.exports = {
  hasJsonStructure,
  mergeDeep,
  wrapTemplates,
  pipe,
  pipeAsync
}