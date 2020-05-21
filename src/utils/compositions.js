const jsonTemplate = require('json-templates')

const pipe = val => (...fns) => (
  fns.reduce((acc, currentFn) => currentFn(acc), val)
)

const wrapTemplates = templates => Object.keys(templates)
  .reduce((obj, key) => ({
  [key]: jsonTemplate(templates[key]),
  ...obj
}), {})

module.exports = {
  pipe,
  wrapTemplates
}