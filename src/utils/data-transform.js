const deepExtend = require('deep-extend')

const mergeDeep = (...args) => deepExtend({}, ...args)

module.exports = {
  mergeDeep
}
