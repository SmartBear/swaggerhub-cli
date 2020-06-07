const { putApi } = require('../../actions/api')
const { getIdentifierArg } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class PublishCommand extends BaseCommand {
  
  async run() {
    const { args } = this.parse(PublishCommand)
    const identifier = getIdentifierArg(args)
    const [owner, name, version] = identifier.split('/')

    const publishApi = {
      pathParams: [owner, name, version, 'settings', 'lifecycle'],
      body: JSON.stringify({ published: true })
    }
    await this.execute(() => putApi(publishApi), () => this.log(`Published API ${identifier}`))
  }
}

PublishCommand.description = `publish an API version
`

PublishCommand.examples = [
  'swaggerhub api:publish organization/api/1.0.0'
]

PublishCommand.args = BaseCommand.args

module.exports = PublishCommand
