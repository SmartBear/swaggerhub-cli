import { Args } from '@oclif/core'
import { getDomainIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import BaseCommand from '../../support/command/base-command.js'
import UpdateCommand from '../../support/command/update-command.js'

class SetDefaultDomainCommand extends UpdateCommand {

  async run() {
    const { args } = await this.parse(SetDefaultDomainCommand)
    const domainPath = getDomainIdentifierArg(args)
    const [owner, name, version] = splitPathParams(domainPath)

    await this.updateDefault('domains', owner, name, version)
  }
}

SetDefaultDomainCommand.description = 'set the default version of a domain'

SetDefaultDomainCommand.examples = [
  'swaggerhub domain:setdefault organization/domain/2.0.0'
]

SetDefaultDomainCommand.args = {
  'OWNER/DOMAIN_NAME/VERSION': Args.string({
    required: true,
    description: 'Domain to set as default on SwaggerHub'
  })
}

SetDefaultDomainCommand.flags = BaseCommand.flags

export default SetDefaultDomainCommand
