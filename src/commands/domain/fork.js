import BaseCommand from '../../support/command/base-command.js'
import { Args, Flags, Errors } from '@oclif/core'
import { getDomainIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import { errorMsg } from '../../template-strings/index.js'
import { postDomain } from '../../requests/domain.js'

const { CLIError } = Errors

const targetRegex = new RegExp(/^[\w\-.]+\/[\w\-.]+\/[\w\-.]+$/)

const getTarget = args => {
  const target = args['NEW_OWNER/NEW_DOMAIN_NAME/NEW_VERSION']
  if (!targetRegex.test(target)) {
    throw new CLIError(errorMsg.argsMustMatchFormat({ format: 'NEW_OWNER/NEW_DOMAIN_NAME/NEW_VERSION' }))
  }
  const [owner, name, version] = splitPathParams(target)
  return { owner, name, version }
}

class ForkDomainCommand extends BaseCommand {

  async run() {
    const { args, flags } = await this.parse(ForkDomainCommand)

    const domainPath = getDomainIdentifierArg(args)
    const body = getTarget(args)
    const forkPath = `${body.owner}/${body.name}/${body.version}`
    if (flags.project) body.project = flags.project
    if (flags.visibility) body.private = flags.visibility === 'private'

    this.log(`Forking domain: '${domainPath}' as '${forkPath}'`)

    await this.executeHttp({
      execute: () => postDomain({
        pathParams: [domainPath, 'fork'],
        body: JSON.stringify(body)
      }),
      onResolve: this.logCommandSuccess({ domainPath, forkPath }),
      options: {}
    })
  }
}

ForkDomainCommand.description = `fork a domain version
The fork can be created as a new domain, or as a new version of another existing domain.
`

ForkDomainCommand.examples = [
  'swaggerhub domain:fork organization/domain/1.0.0 myorg/domain-fork/1.0.0',
  'swaggerhub domain:fork organization/domain/1.0.0 myorg/domain-fork/1.0.0 --project my-project --visibility private'
]

ForkDomainCommand.args = {
  'OWNER/DOMAIN_NAME/VERSION': Args.string({
    required: true,
    description: 'Domain version to fork'
  }),
  'NEW_OWNER/NEW_DOMAIN_NAME/NEW_VERSION': Args.string({
    required: true,
    description: 'Owner, name and version of the fork. An existing domain name creates a new version of it.'
  })
}

ForkDomainCommand.flags = {
  project: Flags.string({
    description: 'existing project of the target organization to add the fork to'
  }),
  visibility: Flags.string({
    description: 'visibility of the fork (defaults to the visibility of the source version)',
    options: ['public', 'private']
  }),
  ...BaseCommand.flags
}

export default ForkDomainCommand
