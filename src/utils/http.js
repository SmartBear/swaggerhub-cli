const acceptHeader = type => ({
  'Accept': `application/${type}`
})

const contentTypeHeader = type => ({
  'Content-Type': `application/${type}`
})

const reqType = ({ json }) => json ? 'json' : 'yaml'

const authHeader = apiKey => ({
  'Authorization': `Bearer ${apiKey}`
})

module.exports = {
  acceptHeader,
  contentTypeHeader,
  reqType,
  authHeader
}
