const BaseCommand = require('../../support/command/base-command')
const { Args, Flags } = require('@oclif/core')
const { getDomainIdentifierArg, apiNameRegex } = require('../../support/command/parse-input')
const { errorMsg } = require('../../template-strings')
const { CLIError } = require('@oclif/core/lib/errors')
const { postDomain } = require('../../requests/domain')

const getNewVersion = args => {
  const newVersion = args['NEW_VERSION']
  if (!apiNameRegex.test(newVersion)) {
    throw new CLIError(errorMsg.argsMustMatchFormat({ format: 'NEW_VERSION' }))
  }
  return newVersion
}

class CloneDomainCommand extends BaseCommand {

  async run() {
    const { args, flags } = await this.parse(CloneDomainCommand)

    const domainPath = getDomainIdentifierArg(args)
    const newVersion = getNewVersion(args)
    const body = { version: newVersion }
    if (flags.visibility) body.private = flags.visibility === 'private'

    this.log(`Cloning domain: '${domainPath}' as version '${newVersion}'`)

    await this.executeHttp({
      execute: () => postDomain({
        pathParams: [domainPath, 'clone'],
        body: JSON.stringify(body)
      }),
      onResolve: this.logCommandSuccess({ domainPath, newVersion }),
      options: {}
    })
  }
}

CloneDomainCommand.description = 'clone a domain version as a new version'

CloneDomainCommand.examples = [
  'swaggerhub domain:clone organization/domain/1.0.0 1.0.1',
  'swaggerhub domain:clone organization/domain/1.0.0 1.0.1 --visibility public'
]

CloneDomainCommand.args = {
  'OWNER/DOMAIN_NAME/VERSION': Args.string({
    required: true,
    description: 'Domain version to clone'
  }),
  'NEW_VERSION': Args.string({
    required: true,
    description: 'Version identifier of the new domain version'
  })
}

CloneDomainCommand.flags = {
  visibility: Flags.string({
    description: 'visibility of the new version (defaults to the server setting)',
    options: ['public', 'private']
  }),
  ...BaseCommand.flags
}

module.exports = CloneDomainCommand
