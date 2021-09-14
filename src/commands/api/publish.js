const { getApiIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')
const UpdateCommand = require('../../support/command/update-command')

class PublishCommand extends UpdateCommand {
  async run() {
    const { args } = this.parse(PublishCommand)
    const apiPath = getApiIdentifierArg(args)
    const [owner, name, version] = splitPathParams(apiPath)

    await this.updatePublish('apis', owner, name, version, true)    
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
