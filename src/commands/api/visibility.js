const { flags } = require('@oclif/command')
const BaseCommand = require('../../support/command/base-command')
const { getApiIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { putApi } = require('../../requests/api')

class VisibilityCommand extends BaseCommand {
    async run() {
        const { args, flags } = this.parse(VisibilityCommand)
        const apiPath = getApiIdentifierArg(args)
        const [owner, name] = splitPathParams(apiPath)
        const version = await this.getDefaultApiVersion([owner, name])
        const isPrivate = !!flags.private || !flags.public
        const updateApiObj = {
          pathParams: [owner, name, version, 'settings', 'private'],
          body: JSON.stringify({ private: isPrivate })
        }
    
        await this.executeHttp({
            execute: () => putApi(updateApiObj), 
            onResolve: this.logCommandSuccess({ owner, name, version }),
            options: { resolveStatus: [403] }
        })
    }
}

VisibilityCommand.description = 'Set visibility of an API definition'

VisibilityCommand.examples = [
    'swaggerhub api:visibility organization/api --private',
    'swaggerhub api:visibility organization/api --public'
]
  
VisibilityCommand.args = [{
    name: 'OWNER/API_NAME/[VERSION]',
    required: true,
    description: 'API Identifier'
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