const { Command, flags } = require('@oclif/command')
const { getIdentifierArg } = require('../../support/command/parse-input')
const { getApi } = require('../../actions/api')
const { parseResponse, checkForErrors, handleErrors } = require('../../support/command/response-handler')

class GetAPICommand extends Command {

  async run() {    
    const { args, flags } = this.parse(GetAPICommand)    
    const identifier = getIdentifierArg(args, false).split('/')

    if (identifier.length == 2) {
      // Get default version of API
      const getVersion = await getApi([...identifier, 'settings', 'default'], true).then(parseResponse)
      if (getVersion.ok) {
        const defaultVersion = JSON.parse(getVersion.content).version
        identifier.push(defaultVersion)
      } else {
        handleErrors(getVersion)
      }
    }

    await getApi(identifier, flags)
    .then(parseResponse)
    .then(checkForErrors)
    .then(this.log)
    .catch(handleErrors)
  }
}

GetAPICommand.description = `fetches an API version
When VERSION is not included in the argument, the default version will be returned.
Returns the API in YAML format by default.
`

GetAPICommand.examples = [
  'swaggerhub api:get organization/api',
  'swaggerhub api:get organization/api/1.0.0 --json'
]

GetAPICommand.args = [{ 
  name: 'OWNER/API_NAME/[VERSION]',
  required: true,
  description: 'SwaggerHub API to fetch'
}]

GetAPICommand.flags = {
  json: flags.boolean({
    char: 'j',
    description: 'returns the API in JSON format.'
  })
}

module.exports = GetAPICommand
