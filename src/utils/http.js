const { getConfig } = require('../services/config')

const acceptHeader = type => ({
  'Accept': `application/${type}`
})

const reqType = ({ json }) => json ? 'json' : 'yaml'

const auth = obj => ({
  'Authorization': getConfig().apiKey
})

module.exports = {
  acceptHeader,
  reqType,
  auth
}
