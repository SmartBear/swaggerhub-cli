const { getConfig } = require('../services/config')

const acceptHeader = type => ({
  'Accept': `application/${type}`
})

const contentTypeHeader = type => ({
  'Content-Type': `application/${type}`
})

const reqType = ({ json }) => json ? 'json' : 'yaml'

const authHeader = () => ({
  'Authorization': `Bearer ${getConfig().apiKey}`
})

module.exports = {
  acceptHeader,
  contentTypeHeader,
  reqType,
  authHeader
}
