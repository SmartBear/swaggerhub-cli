const { Command, flags } = require('@oclif/command')
const { getIdentifierArg } = require('../../../utils/input-validation')
const { getApiVersion } = require('../../../actions/api')
const { parseResponse, checkForErrors, handleErrors } = require('../../../utils/command-response-handler')

class GetAPICommand extends Command {



  async run() {
    const { args, flags } = this.parse(GetAPICommand)
    await getApiVersion(getIdentifierArg(args), flags)
    .then(parseResponse)
    .then(checkForErrors)
    .then(this.log)
    .catch(handleErrors)
  }
}

GetAPICommand.description = 'fetches an API version'

GetAPICommand.flags = {
  json: flags.boolean({
    char: 'j',
    description: 'returns the API in JSON format.'
  })
}

GetAPICommand.args = [{ 
  name: 'identifier',
  required: true,
  description: 'identifier for API in {owner}/{api_name}/{version} format'
}]

module.exports = GetAPICommand
