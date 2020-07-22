const { putApi } = require('../../requests/api')
const { getApiIdentifierArg } = require('../../support/command/parse-input')
const { infoMsg } = require('../../template-strings')
const BaseCommand = require('../../support/command/base-command')

class PublishCommand extends BaseCommand {

  logSuccessMessage = apiPath => {
    const message = infoMsg.publishedApiVersion({ apiPath })
    return () => this.log(message)
  }
  
  async run() {
    const { args } = this.parse(PublishCommand)
    const apiPath = getApiIdentifierArg(args)

    const publish = {
      pathParams: [apiPath, 'settings', 'lifecycle'],
      body: JSON.stringify({ published: true })
    }
    
    await this.executeHttp({
      execute: () => putApi(publish), 
      onResolve: this.logSuccessMessage(apiPath),
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
