const { flags } = require('@oclif/command')
const BaseCommand = require('../../support/command/base-command')
const { getApiIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { putApi } = require('../../requests/api')

class VisibilityCommand extends BaseCommand {
    async run() {
        const { args, flags } = this.parse(VisibilityCommand)
        const apiPath = getApiIdentifierArg(args)
        const [owner, name, version] = splitPathParams(apiPath)
        const apiVersion = version || await this.getDefaultApiVersion([owner, name])
        const isPrivate = flags.visibility === 'private'
        const updateApiObj = {
          pathParams: [owner, name, apiVersion, 'settings', 'private'],
          body: JSON.stringify({ private: isPrivate })
        }
    
        await this.executeHttp({
            execute: () => putApi(updateApiObj), 
            onResolve: this.logCommandSuccess({ owner, name, version: apiVersion }),
            options: { resolveStatus: [403] }
        })
    }
}

VisibilityCommand.description = 'Set visibility of an API definition'

VisibilityCommand.examples = [
    'swaggerhub api:visibility organization/api --visibility=public',
]
  
VisibilityCommand.args = [{
    name: 'OWNER/API_NAME/[VERSION]',
    required: true,
    description: 'API Identifier'
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