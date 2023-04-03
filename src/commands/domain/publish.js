const { Args } = require('@oclif/core')
const { getDomainIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')
const UpdateCommand = require('../../support/command/update-command')

class PublishCommand extends UpdateCommand {
  
  async run() {
    const { args } = await this.parse(PublishCommand)
    const domainPath = getDomainIdentifierArg(args)
    const [owner, name, version] = splitPathParams(domainPath)

    await this.updatePublish('domains', owner, name, version, true)
  }
}

PublishCommand.description = 'publish a domain version'

PublishCommand.examples = [
  'swaggerhub domain:publish organization/domain/1.0.0'
]

PublishCommand.args = {
  'OWNER/DOMAIN_NAME/VERSION': Args.string({
    required: true,
    description: 'Domain to publish on SwaggerHub'
  })
}

PublishCommand.flags = BaseCommand.flags

module.exports = PublishCommand
