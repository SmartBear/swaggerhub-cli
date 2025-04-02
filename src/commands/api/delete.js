const { Flags, Args } = require('@oclif/core')
const { deleteApi } = require('../../requests/api')
const { getApiIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')
const inquirer = require('inquirer')

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

  confirmDeletion(apiName) {
    return import('inquirer')
        .then(module => module.default)
        .then(inquirer => inquirer.prompt([
          {
            type: 'confirm',
            name: 'answer',
            message: `Are you sure you want to delete '${apiName}' definition entirely?`,
            default: false
          }
        ]))
        .then(confirm => confirm.answer)
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

module.exports = DeleteAPICommand
