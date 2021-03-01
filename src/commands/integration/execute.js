const { postApi } = require('../../requests/api')
const { getIntegrationIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class ExecuteIntegrationCommand extends BaseCommand {

  async run() {
      const { args } = this.parse(ExecuteIntegrationCommand)
      const integrationPath = getIntegrationIdentifierArg(args)
      await this.executeIntegration(integrationPath)
  }

  async executeIntegration(integrationPath) {
    const [owner, api, version, integrationId] = splitPathParams(integrationPath)

    return this.executeHttp({
      execute: () => postApi({ pathParams: [owner, api, version, 'integrations', integrationId, 'execute'] }), 
      onResolve: this.logCommandSuccess({ integrationPath }),
      options: {}
    })
  }  
}

ExecuteIntegrationCommand.description = 'executes an integration for the given API.'

ExecuteIntegrationCommand.examples = [
  'swaggerhub integration:execute organization/api/1.0.0/503c2db6-448a-4678-a310-f465429e9704'
]

ExecuteIntegrationCommand.args = [{ 
  name: 'OWNER/API_NAME/VERSION/INTEGRATION_ID',
  required: true,
  description: 'Integration to execute for given API'
}]

ExecuteIntegrationCommand.flags = {
  ...BaseCommand.flags
}

module.exports = ExecuteIntegrationCommand
