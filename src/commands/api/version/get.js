const { Command, flags } = require('@oclif/command')
const { getIdentifierArg } = require('../../../utils/input-validation')
const { getApiVersion } = require('../../../actions/api')
const { parseResponse, checkForErrors } = require('../../../utils/command-response-handler')

class GetAPICommand extends Command {

  static args = [
    { name: 'identifier' },
  ]

  static flags = {
    json: flags.boolean({
      char: 'j',
      description: 'Returns the API in JSON format.'
    })
  }

  async run() {
    const { args, flags } = this.parse(GetAPICommand)
    await getApiVersion(this, getIdentifierArg(args), flags)
    .then(parseResponse)
    .then(checkForErrors)
    .then(this.log)
  }
}

GetAPICommand.description = 'Fetches an API version'

module.exports = GetAPICommand
