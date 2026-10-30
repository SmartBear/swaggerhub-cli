const BaseCommand = require('../../support/command/base-command')
const { Args, Flags } = require('@oclif/core')
const {
  noVersionRegex,
  apiNameRegex
} = require('../../support/command/parse-input')
const { errorMsg } = require('../../template-strings')
const { CLIError } = require('@oclif/core/lib/errors')
const { postDomain } = require('../../requests/domain')

const getDomainToRename = args => {
  const domainPath = args['OWNER/DOMAIN_NAME']
  if (!noVersionRegex.test(domainPath)) {
    throw new CLIError(errorMsg.argsMustMatchFormat({ format: 'OWNER/DOMAIN_NAME' }))
  }
  return domainPath
}

const getDomainNewName = args => {
  const newName = args['DOMAIN_NEW_NAME']
  if (!apiNameRegex.test(newName)) {
    throw new CLIError(errorMsg.argsMustMatchFormat({ format: 'DOMAIN_NEW_NAME' }))
  }
  return newName
}

class RenameDomainCommand extends BaseCommand {

  async run() {
    const { args, flags } = await this.parse(RenameDomainCommand)

    const domainPath = getDomainToRename(args)
    const newName = getDomainNewName(args)
    const queryParams = { newName }
    if (flags.force) queryParams.force = 'true'

    this.log(`Renaming domain: '${domainPath}' to '${newName}'`)

    await this.executeHttp({
      execute: () => postDomain({
        pathParams: [domainPath, 'rename'],
        queryParams,
        body: '{}'
      }),
      onResolve: this.logCommandSuccess({ domainPath, newName }),
      options: {}
    })
  }
}

RenameDomainCommand.description = 'rename a domain'

RenameDomainCommand.examples = [
  'swaggerhub domain:rename organization/domainOldName domainNewName',
  'swaggerhub domain:rename organization/domainOldName domainNewName --force'
]

RenameDomainCommand.args = {
  'OWNER/DOMAIN_NAME': Args.string({
    required: true,
    description: 'Domain to be renamed'
  }),
  'DOMAIN_NEW_NAME': Args.string({
    required: true,
    description: 'New name for the domain'
  })
}

RenameDomainCommand.flags = {
  force: Flags.boolean({
    char: 'f',
    description: 'rename the domain even if it is referenced by APIs or other domains'
  }),
  ...BaseCommand.flags
}

module.exports = RenameDomainCommand
