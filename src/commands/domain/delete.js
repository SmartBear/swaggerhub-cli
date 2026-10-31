import { Flags, Args } from '@oclif/core'
import { deleteDomain } from '../../requests/domain.js'
import { getDomainIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import BaseCommand from '../../support/command/base-command.js'
import inquirer from 'inquirer'

class DeleteDomainCommand extends BaseCommand {

  async run() {
    const { args, flags } = await this.parse(DeleteDomainCommand)
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

DeleteDomainCommand.args = {
  'OWNER/DOMAIN_NAME/[VERSION]': Args.string({
    required: true,
    description: 'Domain to delete on SwaggerHub'
  })
}

DeleteDomainCommand.flags = {
  force: Flags.boolean({
    char: 'f', 
    description: 'delete domain without prompting for confirmation'
  }),
  ...BaseCommand.flags
}

export default DeleteDomainCommand
