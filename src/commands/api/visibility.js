const { flags } = require('@oclif/command')
const BaseCommand = require('../../support/command/base-command')
const { getApiIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { putApi } = require('../../requests/api')

class VisibilityCommand extends BaseCommand {
    async run() {
        const { args, flags } = this.parse(VisibilityCommand)
        const apiPath = getApiIdentifierArg(args)
        const [owner, name] = splitPathParams(apiPath)
        const apiVersion = await this.getDefaultVersion([owner, name])
        const isPrivate = !!flags.private
        const updateApiObj = {
          pathParams: [owner, name, apiVersion, 'settings', 'private'],
          body: JSON.stringify({ private: isPrivate })
        }
    
        await this.executeHttp({
            execute: () => putApi(updateApiObj), 
            onResolve: this.logCommandSuccess({ apiPath }),
            options: { resolveStatus: [403] }
        })
    }
}

VisibilityCommand.examples = [
    'swaggerhub api:visibility organization/api --private',
    'swaggerhub api:visibility organization/api'
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
    }),
    ...BaseCommand.flags
}

module.exports = VisibilityCommand