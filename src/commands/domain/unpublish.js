import { Args } from '@oclif/core'
import { getDomainIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import BaseCommand from '../../support/command/base-command.js'
import UpdateCommand from '../../support/command/update-command.js'

class UnpublishCommand extends UpdateCommand {
  
  async run() {
    const { args } = await this.parse(UnpublishCommand)
    const domainPath = getDomainIdentifierArg(args)
    const [owner, name, version] = splitPathParams(domainPath)

    await this.updatePublish('domains', owner, name, version, false)
  }
}

UnpublishCommand.description = 'unpublish a domain version'

UnpublishCommand.examples = [
  'swaggerhub domain:unpublish organization/domain/1.0.0'
]

UnpublishCommand.args = {
  'OWNER/DOMAIN_NAME/VERSION': Args.string({
    required: true,
    description: 'Domain to unpublish on SwaggerHub'
  })
}

UnpublishCommand.flags = BaseCommand.flags

export default UnpublishCommand
