const acceptHeader = type => ({
  'Accept': `application/${type}`
})

const contentTypeHeader = type => ({
  'Content-Type': `application/${type}`
})

const authHeader = apiKey => ({
  'Authorization': `Bearer ${apiKey}`
})

const userAgentHeader = () => ({
  'User-Agent': global.shUserAgent
})

const reqType = ({ json }) => json ? 'json' : 'yaml'

module.exports = {
  acceptHeader,
  contentTypeHeader,
  userAgentHeader,
  authHeader,
  reqType
}
