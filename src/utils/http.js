const acceptHeader = type => ({
  'Accept': `application/${type}`
})

const reqType = ({ json }) => json ? 'json' : 'yaml'

const authHeader = apiKey => ({
  'Authorization': `Bearer ${apiKey}`
})

module.exports = {
  acceptHeader,
  reqType,
  authHeader
}
