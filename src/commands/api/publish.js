const { Flags, Args } = require('@oclif/core')
const { getApiIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')
const UpdateCommand = require('../../support/command/update-command')
const inquirer = require('inquirer')

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

module.exports = PublishCommand
