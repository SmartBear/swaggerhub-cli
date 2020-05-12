const deepExtend = require('deep-extend')

const mergeDeep = (...args) => {
  return deepExtend({}, ...args)
}

module.exports = {
  mergeDeep
}
