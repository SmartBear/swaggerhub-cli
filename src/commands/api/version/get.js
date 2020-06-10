const { Command, flags } = require('@oclif/command')
const { getIdentifierArg } = require('../../../support/command/parse-input')
const { getApiVersion } = require('../../../actions/api')
const { parseResponse, checkForErrors, handleErrors } = require('../../../support/command/response-handler')

class GetAPICommand extends Command {

  async run() {
    const { args, flags } = this.parse(GetAPICommand)
    await getApiVersion(getIdentifierArg(args), flags)
    .then(parseResponse)
    .then(checkForErrors())
    .then(this.log)
    .catch(handleErrors)
  }
}

GetAPICommand.description = `fetches an API version
Returns the API in YAML format by default.
`

GetAPICommand.examples = ['swaggerhub api:version:get organization/api/1.0.0 --json']

GetAPICommand.flags = {
  json: flags.boolean({
    char: 'j',
    description: 'returns the API in JSON format.'
  })
}

GetAPICommand.args = [{ 
  name: 'OWNER/API_NAME/VERSION',
  required: true,
  description: 'API version in SwaggerHub'
}]

module.exports = GetAPICommand
