const { putApi } = require('../../requests/api')
const { getApiIdentifierArg } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class PublishCommand extends BaseCommand {
  async run() {
    const { args } = this.parse(PublishCommand)
    const apiPath = getApiIdentifierArg(args)

    const publish = {
      pathParams: [apiPath, 'settings', 'lifecycle'],
      body: JSON.stringify({ published: true })
    }
    
    await this.executeHttp({
      execute: () => putApi(publish), 
      onResolve: this.logCommandSuccess({ apiPath }),
      options: { resolveStatus: [403] }
    })
  }
}

PublishCommand.description = 'publish an API version'

PublishCommand.examples = [
  'swaggerhub api:publish organization/api/1.0.0'
]

PublishCommand.args = [{ 
  name: 'OWNER/API_NAME/VERSION',
  required: true,
  description: 'API identifier'
}]

PublishCommand.flags = BaseCommand.flags

module.exports = PublishCommand
