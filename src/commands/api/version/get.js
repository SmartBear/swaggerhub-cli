const { flags } = require('@oclif/command')
const { getIdentifierArg } = require('../../../support/command/parse-input')
const { getApiVersion } = require('../../../actions/api')
const BaseCommand = require('../../../support/command/base-command')

class GetAPICommand extends BaseCommand {

  async run() {
    const { args, flags } = this.parse(GetAPICommand)
    await this.execute(() => getApiVersion(getIdentifierArg(args), flags), this.log)
  }
}

GetAPICommand.description = `fetches an API version
returns the API in YAML format by default
`

GetAPICommand.examples = ['swaggerhub api:version:get organization/api/1.0.0 --json']

GetAPICommand.flags = {
  json: flags.boolean({
    char: 'j',
    description: 'returns the API in JSON format.'
  }),
  ...BaseCommand.flags
}

GetAPICommand.args = BaseCommand.args

module.exports = GetAPICommand
