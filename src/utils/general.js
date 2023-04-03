const deepExtend = require('deep-extend')
const jsonTemplate = require('json-templates')

const pick = (object, keys) => {
  const newObject = {}
  for (const key of keys) {
    if (key in object) {
      newObject[key] = object[key]
    }
  }

  return newObject
}

const omit = (object, keys_) => {
  const keys = new Set(keys_)
  const newObject = {}
  for (const [key, value] of Object.entries(object)) {
    if (!keys.has(key)) {
      newObject[key] = value
    }
  }

  return newObject
}

const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

const pipe = (...fns) => val => (
  fns.reduce((acc, currentFn) => currentFn(acc), val)
)

const pipeAsync = (...fns) => val => (
  fns.reduce((chain, func) => chain.then(func), Promise.resolve(val))
)

const wrapTemplates = templates => Object.keys(templates)
  .reduce((obj, key) => ({
  [key]: jsonTemplate(templates[key]),
  ...obj
}), {})

const mergeDeep = (...args) => deepExtend({}, ...args)

const capitalise = str => (
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`
)

const isError = error => error instanceof Error === true

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

const prettyPrintJSON = str => {
  const result = JSON.parse(str)
  return JSON.stringify(result, null, 2)
}

module.exports = {
  hasJsonStructure,
  prettyPrintJSON,
  isError,
  capitalise,
  mergeDeep,
  wrapTemplates,
  pipe,
  pipeAsync,
  pick,
  omit,
  isEqual
}