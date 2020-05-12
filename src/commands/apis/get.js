const { Command, flags } = require('@oclif/command')
const fetch = require('node-fetch')
const {acceptHeader, reqType} = require('../../services/http')

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
    const identifier = args.identifier
    const headers = acceptHeader(reqType(flags))

    fetch(`https://dev-api.swaggerhub.com/apis/${identifier}`, {
      headers: headers
    })
      .then(res => res.text())
      .then(text => console.log(text))
  }
}

GetAPICommand.description = 'Fetches an API version'

module.exports = GetAPICommand
