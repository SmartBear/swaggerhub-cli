const { flags } = require('@oclif/command')
const BaseCommand = require('../../support/command/base-command')
const { getDomainIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { putDomain } = require('../../requests/domain')

class VisibilityCommand extends BaseCommand {
    async run() {
        const { args, flags } = this.parse(VisibilityCommand)
        const domainPath = getDomainIdentifierArg(args)
        const [owner, name] = splitPathParams(domainPath)
        const version = await this.getDefaultDomainVersion([owner, name])
        const isPrivate = !!flags.private
        const updateDomainObj = {
          pathParams: [owner, name, version, 'settings', 'private'],
          body: JSON.stringify({ private: isPrivate })
        }
    
        await this.executeHttp({
            execute: () => putDomain(updateDomainObj), 
            onResolve: this.logCommandSuccess({ owner, name, version }),
            options: { resolveStatus: [403] }
        })
    }
}

VisibilityCommand.description = 'Set visibility of a Domain'

VisibilityCommand.examples = [
    'swaggerhub domain:visibility organization/domain --private',
    'swaggerhub domain:visibility organization/domain'
]
  
VisibilityCommand.args = [{
    name: 'OWNER/DOMAIN_NAME/[VERSION]',
    required: true,
    description: 'Domain Identifier'
}]

VisibilityCommand.flags = {
    private: flags.boolean({
        description: 'sets the default Domain version as private',
        default: false,
        required: false,
    }),
    ...BaseCommand.flags
}

module.exports = VisibilityCommand