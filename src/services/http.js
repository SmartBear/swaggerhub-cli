const acceptHeader = type => ({
    'Accept': `application/${type}`
  })
  
const reqType = ({ json }) => json ? 'json' : 'yaml'

module.exports = {
    acceptHeader,
    reqType
}
