const { Command, flags } = require('@oclif/command')
const fetch = require('node-fetch')
const { acceptHeader, reqType, authHeader } = require('../../../utils/http')
const { getIdentifierArg } = require('../../../utils/input-validation')
const { mergeDeep } = require('../../../utils/data-transform')
const { getConfig } = require('../../../services/config')

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
    const identifier = getIdentifierArg(args)

    await fetch(`${getConfig().swaggerHubUrl}/apis/${identifier}`, {
      headers: mergeDeep(acceptHeader(reqType(flags)), authHeader(getConfig().apiKey))
    })
    .then(res => res.text())
    .then(text => this.log(text))
  }
}

GetAPICommand.description = 'Fetches an API version'

module.exports = GetAPICommand
