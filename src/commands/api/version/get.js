const { Command, flags } = require('@oclif/command')
const { getIdentifierArg } = require('../../../utils/input-validation')
const { getApiVersion } = require('../../../actions/api')
const { parseResponse, checkForErrors, handleErrors } = require('../../../utils/command-response-handler')

class GetAPICommand extends Command {

  static args = [{ 
    name: 'identifier',
    required: true,
    description: 'Identifier for API in format OWNER/API_NAME/VERSION'
  },
  ]

  static flags = {
    json: flags.boolean({
      char: 'j',
      description: 'Returns the API in JSON format.'
    })
  }

  async run() {
    const { args, flags } = this.parse(GetAPICommand)
    await getApiVersion(getIdentifierArg(args), flags)
    .then(parseResponse)
    .then(checkForErrors)
    .then(this.log)
    .catch(handleErrors)
  }
}

GetAPICommand.description = 'Fetches an API version'

module.exports = GetAPICommand
