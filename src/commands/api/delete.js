const { flags } = require('@oclif/command')
const { deleteApi } = require('../../requests/api')
const { getApiIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')
const inquirer = require('inquirer')

class DeleteAPICommand extends BaseCommand {

  async run() {
    const { args, flags } = this.parse(DeleteAPICommand)
    const apiPath = getApiIdentifierArg(args)
    const [owner, name, version] = splitPathParams(apiPath)

    if (version) {
      this.logCommandSuccess = this.setSuccessMessage('deletedApiVersion')
    } else if (!flags.force && await this.confirmDeletion(name) == false) {
      return
    }

    await this.executeHttp({
      execute: () => deleteApi([apiPath]),
      onResolve: this.logCommandSuccess({ owner, name, version }),
      options: {}
    })
  }

  async confirmDeletion(apiName) {
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'answer',
        message: `Are you sure you want to delete '${apiName}' API definition entirely?`,
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

DeleteAPICommand.args = [{ 
  name: 'OWNER/API_NAME/[VERSION]',
  required: true,
  description: 'API to delete in SwaggerHub'
}]

DeleteAPICommand.flags = {
  force: flags.boolean({
    char: 'f', 
    description: 'delete API without prompting for confirmation'
  }),
  ...BaseCommand.flags
}

module.exports = DeleteAPICommand
