const acceptHeader = type => ({
  'Accept': `application/${type}`
})

const authHeader = apiKey => ({
  'Authorization': `Bearer ${apiKey}`
})

const userAgentHeader = (userAgent, appName) => {
  userAgent = userAgent.replace(appName, `${appName}-cli`)
  return { 'User-Agent': userAgent }
}

const reqType = ({ json }) => json ? 'json' : 'yaml'

module.exports = {
  acceptHeader,
  userAgentHeader,
  authHeader,
  reqType
}
