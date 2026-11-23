import { Flags, Args } from '@oclif/core'
import { getApiIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import BaseCommand from '../../support/command/base-command.js'
import UpdateCommand from '../../support/command/update-command.js'
import prompts from '../../support/inquirer/prompts.js'

class PublishCommand extends UpdateCommand {
  async run() {
    const { args, flags } = await this.parse(PublishCommand)
    const apiPath = getApiIdentifierArg(args)
    const [owner, name, version] = splitPathParams(apiPath)

    await this.updatePublish('apis', owner, name, version, true, flags)
  }

  async confirmPublish() {
    return prompts.confirm(
      `You are about to publish an API referencing unpublished Domains. 
        If those Domains change, it may affect your API definition. 
        Do you wish to continue?`
    )
  }
}

PublishCommand.description = 'publish an API version'

PublishCommand.examples = [
  'swaggerhub api:publish organization/api/1.0.0',
  'swaggerhub api:publish organization/api/1.0.0 --force'
]

PublishCommand.args = {
  'OWNER/API_NAME/VERSION': Args.string({
    required: true,
    description: 'API to publish on Swagger'
  })
}

PublishCommand.flags = {
  force: Flags.boolean({
    char: 'f',
    description: 'publish API without prompting for confirmation'
  }),
  ...BaseCommand.flags
}

export default PublishCommand
