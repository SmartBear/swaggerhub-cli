const { postApi } = require('../../requests/api')
const { getIntegrationIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class GetIntegrationCommand extends BaseCommand {

  async run() {
      const { args } = this.parse(GetIntegrationCommand)
      const integrationPath = getIntegrationIdentifierArg(args)
      await this.executeIntegration(integrationPath)
  }

  async executeIntegration(integrationPath) {
    const [owner, api, version, integrationId] = splitPathParams(integrationPath)

    return this.executeHttp({
      execute: () => postApi({ pathParams: [owner, api, version, 'integrations', integrationId, 'execute'] }), 
      onResolve: this.logCommandSuccess({ apiPath: integrationPath }),
      options: {}
    })
  }  
}

GetIntegrationCommand.description = 'executes an integation for the given API.'

GetIntegrationCommand.examples = [
  'swaggerhub integration:execute organization/api/1.0.0/503c2db6-448a-4678-a310-f465429e9704'
]

GetIntegrationCommand.args = [{ 
  name: 'OWNER/API_NAME/VERSION/INTEGRATION_ID',
  required: true,
  description: 'Integration to execute for given API'
}]

GetIntegrationCommand.flags = {
  ...BaseCommand.flags
}

module.exports = GetIntegrationCommand
