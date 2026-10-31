import { Flags, Args } from '@oclif/core'
import { getApiIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import BaseCommand from '../../support/command/base-command.js'
import UpdateCommand from '../../support/command/update-command.js'
import inquirer from 'inquirer'

class PublishCommand extends UpdateCommand {
  async run() {
    const { args, flags } = await this.parse(PublishCommand)
    const apiPath = getApiIdentifierArg(args)
    const [owner, name, version] = splitPathParams(apiPath)

    await this.updatePublish('apis', owner, name, version, true, flags)
  }

  async confirmPublish() {
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'answer',
        message: `You are about to publish an API referencing unpublished Domains. 
        If those Domains change, it may affect your API definition. 
        Do you wish to continue?`,
        default: false
      }
    ])
    return confirm.answer
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
    description: 'API to publish on Swaggerhub'
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
