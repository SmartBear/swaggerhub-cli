const { getApiIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')
const UpdateCommand = require('../../support/command/update-command')

class UnpublishCommand extends UpdateCommand {
  
  async run() {
    const { args } = await this.parse(UnpublishCommand)
    const apiPath = getApiIdentifierArg(args)
    const [owner, name, version] = splitPathParams(apiPath)

    await this.updatePublish('apis', owner, name, version, false)  
  }
}

UnpublishCommand.description = 'unpublish an API version'

UnpublishCommand.examples = [
  'swaggerhub api:unpublish organization/api/1.0.0'
]

UnpublishCommand.args = [{ 
  name: 'OWNER/API_NAME/VERSION',
  required: true,
  description: 'API identifier'
}]

UnpublishCommand.flags = BaseCommand.flags

module.exports = UnpublishCommand
