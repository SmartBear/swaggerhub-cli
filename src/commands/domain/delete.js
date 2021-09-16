const { flags } = require('@oclif/command')
const { deleteDomain } = require('../../requests/domain')
const { getDomainIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')
const inquirer = require('inquirer')

class DeleteDomainCommand extends BaseCommand {

  async run() {
    const { args, flags } = this.parse(DeleteDomainCommand)
    const domainPath = getDomainIdentifierArg(args)
    const [owner, name, version] = splitPathParams(domainPath)

    if (version) {
      this.logCommandSuccess = this.setSuccessMessage('deletedVersion')
    } else if (!flags.force && await this.confirmDeletion(name) !== true) {
      return
    }

    await this.executeHttp({
      execute: () => deleteDomain([domainPath], { 'force': 'true' }),
      onResolve: this.logCommandSuccess({ type: 'domain', owner, name, version }),
      options: {}
    })
  }

  async confirmDeletion(name) {
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'answer',
        message: `Are you sure you want to delete '${name}' definition entirely?`,
        default: false
      }
    ])
    return confirm.answer
  }
}

DeleteDomainCommand.description = `delete a domain or domain version
`

DeleteDomainCommand.examples = [
  'swaggerhub domain:delete organization/domain/1.0.0',
  'swaggerhub domain:delete organization/domain',
  'swaggerhub domain:delete organization/domain --force'
]

DeleteDomainCommand.args = [{ 
  name: 'OWNER/DOMAIN_NAME/[VERSION]',
  required: true,
  description: 'Domain to delete in SwaggerHub'
}]

DeleteDomainCommand.flags = {
  force: flags.boolean({
    char: 'f', 
    description: 'delete domain without prompting for confirmation'
  }),
  ...BaseCommand.flags
}

module.exports = DeleteDomainCommand
