const { Flags, Args } = require('@oclif/core')
const { getDomainIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')
const UpdateCommand = require('../../support/command/update-command')

class PublishCommand extends UpdateCommand {
  
  async run() {
    const { args, flags } = await this.parse(PublishCommand)
    const domainPath = getDomainIdentifierArg(args)
    const [owner, name, version] = splitPathParams(domainPath)

    await this.updatePublish('domains', owner, name, version, true, flags)
  }
}

PublishCommand.description = 'publish a domain version'

PublishCommand.examples = [
  'swaggerhub domain:publish organization/domain/1.0.0',
  'swaggerhub domain:publish organization/domain/1.0.0 --force'
]

PublishCommand.args = {
  'OWNER/DOMAIN_NAME/VERSION': Args.string({
    required: true,
    description: 'Domain to publish on Swagger'
  })
}

PublishCommand.flags = {
  force: Flags.boolean({
    char: 'f',
    description: 'publish domain without prompting for confirmation'
  }),
  ...BaseCommand.flags
}

module.exports = PublishCommand
