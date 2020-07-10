const { putApi } = require('../../requests/api')
const { getApiIdentifierArg } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class PublishCommand extends BaseCommand {
  
  async run() {
    const { args } = this.parse(PublishCommand)
    const identifier = getApiIdentifierArg(args)
    const [owner, name, version] = identifier.split('/')

    const publish = {
      pathParams: [owner, name, version, 'settings', 'lifecycle'],
      body: JSON.stringify({ published: true })
    }
    await this.executeHttp({
      execute: () => putApi(publish), 
      onResolve: () => this.log(`Published API ${identifier}`),
      options: { resolveStatus: [403] }
    })
  }
}

PublishCommand.description = 'publish an API version'

PublishCommand.examples = [
  'swaggerhub api:publish organization/api/1.0.0'
]

PublishCommand.args = BaseCommand.args

PublishCommand.flags = BaseCommand.flags

module.exports = PublishCommand
