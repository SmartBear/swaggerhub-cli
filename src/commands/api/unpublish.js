const { putApi } = require('../../actions/api')
const { getIdentifierArg } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class UnpublishCommand extends BaseCommand {
  async run() {
    const { args } = this.parse(UnpublishCommand)
    const identifier = getIdentifierArg(args)
    const [owner, name, version] = identifier.split('/')

    const unpublishApi = {
      pathParams: [owner, name, version, 'settings', 'lifecycle'],
      body: JSON.stringify({ published: false })
    }
    await this.executeHttp({
      execute: () => putApi(unpublishApi), 
      onSuccess: () => this.log(`Unpublished API ${identifier}`),
      options: { resolveStatus: [403] }
    })
  }
}

UnpublishCommand.description = `unpublish an API version
`

UnpublishCommand.examples = [
  'swaggerhub api:unpublish organization/api/1.0.0'
]

UnpublishCommand.args = BaseCommand.args

UnpublishCommand.flags = BaseCommand.flags

module.exports = UnpublishCommand
