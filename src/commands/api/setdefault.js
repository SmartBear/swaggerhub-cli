const { putApi } = require('../../requests/api')
const { getApiIdentifierArg } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class SetDefaultCommand extends BaseCommand {
  async run() {
    const { args } = this.parse(SetDefaultCommand)
    const identifier = getApiIdentifierArg(args)
    const [owner, name, version] = identifier.split('/')

    const setDefault = {
      pathParams: [owner, name, 'settings', 'default'],
      body: JSON.stringify({ version: version })
    }
    await this.executeHttp({
      execute: () => putApi(setDefault), 
      onResolve: () => this.log(`Default version of ${owner}/${name} set to ${version}`),
      options: { resolveStatus: [403] }
    })
  }
}

SetDefaultCommand.description = 'set the default version of an API'

SetDefaultCommand.examples = [
  'swaggerhub api:setdefault organization/api/2.0.0'
]

SetDefaultCommand.args = BaseCommand.args

SetDefaultCommand.flags = BaseCommand.flags

module.exports = SetDefaultCommand
