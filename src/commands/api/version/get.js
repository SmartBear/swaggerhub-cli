const { Command, flags } = require('@oclif/command')
const fetch = require('node-fetch')
const { acceptHeader, authHeader, userAgentHeader, reqType } = require('../../../utils/http')
const { getIdentifierArg } = require('../../../utils/input-validation')
const { mergeDeep } = require('../../../utils/data-transform')
const config = require('../../../services/config')

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
    const { swaggerHubUrl, apiKey } = config.getConfig()
    const { userAgent, name } = this.config

    await fetch(`${swaggerHubUrl}/apis/${identifier}`, {
      headers: mergeDeep(
        acceptHeader(reqType(flags)),
        authHeader(apiKey),
        userAgentHeader(userAgent, name))
    })
    .then(res => res.text())
    .then(text => this.log(text))
  }
}

GetAPICommand.description = 'Fetches an API version'

module.exports = GetAPICommand
