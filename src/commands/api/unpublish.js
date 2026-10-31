import { Args } from '@oclif/core'
import { getApiIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import BaseCommand from '../../support/command/base-command.js'
import UpdateCommand from '../../support/command/update-command.js'

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

UnpublishCommand.args = { 
  'OWNER/API_NAME/VERSION': Args.string({
    required: true,
    description: 'API identifier'
  })
}

UnpublishCommand.flags = BaseCommand.flags

export default UnpublishCommand
