const { Args } = require('@oclif/core')
const { deleteApi } = require('../../requests/api')
const { getIntegrationIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class DeleteIntegrationCommand extends BaseCommand {

  async run() {
      const { args } = await this.parse(DeleteIntegrationCommand)
      const integrationPath = getIntegrationIdentifierArg(args)
      await this.deleteIntegration(integrationPath)
  }

  async deleteIntegration(integrationPath) {
    const [owner, api, version, integrationId] = splitPathParams(integrationPath)

    return this.executeHttp({
      execute: () => deleteApi([owner, api, version, 'integrations', integrationId]), 
      onResolve: this.logCommandSuccess({ integrationId, apiPath: [owner, api, version].join('/') }),
      options: {}
    })
  }  
}

DeleteIntegrationCommand.description = 'deletes the integration from the given API.'

DeleteIntegrationCommand.examples = [
  'swaggerhub integration:delete organization/api/1.0.0/503c2db6-448a-4678-a310-f465429e9704'
]

DeleteIntegrationCommand.args = { 
  'OWNER/API_NAME/VERSION/INTEGRATION_ID': Args.string({
    required: true,
  description: 'Integration to delete for given API on Swaggerhub'
  })
}

DeleteIntegrationCommand.flags = {
  ...BaseCommand.flags
}

module.exports = DeleteIntegrationCommand
