const { flags } = require('@oclif/command')
const BaseCommand = require('../../support/command/base-command')
const { getDomainIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { putDomain } = require('../../requests/domain')

class VisibilityCommand extends BaseCommand {
    async run() {
        const { args, flags, version } = this.parse(VisibilityCommand)
        const domainPath = getDomainIdentifierArg(args)
        const [owner, name] = splitPathParams(domainPath)
        const apiVersion = version || await this.getDefaultApiVersion([owner, name])
        const isPrivate = flags.visibility === 'private'
        const updateDomainObj = {
          pathParams: [owner, name, apiVersion, 'settings', 'private'],
          body: JSON.stringify({ private: isPrivate })
        }
    
        await this.executeHttp({
            execute: () => putDomain(updateDomainObj), 
            onResolve: this.logCommandSuccess({ owner, name, version: apiVersion }),
            options: { resolveStatus: [403] }
        })
    }
}

VisibilityCommand.description = 'Set visibility of a Domain'

VisibilityCommand.examples = [
    'swaggerhub domain:visibility organization/domain --visibility=public',
]
  
VisibilityCommand.args = [{
    name: 'OWNER/DOMAIN_NAME/[VERSION]',
    required: true,
    description: 'Domain Identifier'
}]


VisibilityCommand.flags = {
    visibility: flags.string({
        description: 'visibility of API in SwaggerHub',
        options: ['public', 'private'],
        default: 'private',
        required: true
    }),
    ...BaseCommand.flags
}

module.exports = VisibilityCommand