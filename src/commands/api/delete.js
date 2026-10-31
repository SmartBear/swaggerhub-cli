import { Flags, Args } from '@oclif/core'
import { deleteApi } from '../../requests/api.js'
import { getApiIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import BaseCommand from '../../support/command/base-command.js'
import inquirer from 'inquirer'

class DeleteAPICommand extends BaseCommand {

  async run() {
    const { args, flags } = await this.parse(DeleteAPICommand)
    const apiPath = getApiIdentifierArg(args)
    const [owner, name, version] = splitPathParams(apiPath)

    if (version) {
      this.logCommandSuccess = this.setSuccessMessage('deletedVersion')
    } else if (!flags.force && await this.confirmDeletion(name) !== true) {
      return
    }

    await this.executeHttp({
      execute: () => deleteApi([apiPath]),
      onResolve: this.logCommandSuccess({ type: 'API', owner, name, version }),
      options: {}
    })
  }

  async confirmDeletion(apiName) {
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'answer',
        message: `Are you sure you want to delete '${apiName}' definition entirely?`,
        default: false
      }
    ])
    return confirm.answer
  }
}

DeleteAPICommand.description = `delete an API or API version
`

DeleteAPICommand.examples = [
  'swaggerhub api:delete organization/api/1.0.0',
  'swaggerhub api:delete organization/api',
  'swaggerhub api:delete organization/api --force'
]

DeleteAPICommand.args = { 
  'OWNER/API_NAME/[VERSION]': Args.string({
    required: true,
    description: 'API to delete on SwaggerHub'
  })
}

DeleteAPICommand.flags = {
  force: Flags.boolean({
    char: 'f', 
    description: 'delete API without prompting for confirmation'
  }),
  ...BaseCommand.flags
}

export default DeleteAPICommand
