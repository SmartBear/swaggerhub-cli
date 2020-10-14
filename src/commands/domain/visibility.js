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
        const isPrivate = !!flags.private || !flags.public
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
    'swaggerhub domain:visibility organization/domain --public'
]
  
VisibilityCommand.args = [{
    name: 'OWNER/DOMAIN_NAME/[VERSION]',
    required: true,
    description: 'Domain Identifier'
}]

VisibilityCommand.flags = {
    private: flags.boolean({
        description: 'sets the default API version as private',
        default: false,
        required: false,
        exclusive: ['public'],
    }),
    public: flags.boolean({
        description: 'sets the default API version as public',
        default: false,
        required: false,
        exclusive: ['private'],
    }),
    ...BaseCommand.flags
}

module.exports = VisibilityCommand