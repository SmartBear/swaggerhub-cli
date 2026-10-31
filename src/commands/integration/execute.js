import { Args } from '@oclif/core'
import { postApi } from '../../requests/api.js'
import { getIntegrationIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import BaseCommand from '../../support/command/base-command.js'

class ExecuteIntegrationCommand extends BaseCommand {

  async run() {
      const { args } = await this.parse(ExecuteIntegrationCommand)
      const integrationPath = getIntegrationIdentifierArg(args)
      await this.executeIntegration(integrationPath)
  }

  async executeIntegration(integrationPath) {
    const [owner, api, version, integrationId] = splitPathParams(integrationPath)

    return this.executeHttp({
      execute: () => postApi({ pathParams: [owner, api, version, 'integrations', integrationId, 'execute'] }), 
      onResolve: this.logCommandSuccess({ integrationId, apiPath: `${owner}/${api}/${version}` }),
      options: {}
    })
  }  
}

ExecuteIntegrationCommand.description = 'executes an integration for the given API.'

ExecuteIntegrationCommand.examples = [
  'swaggerhub integration:execute organization/api/1.0.0/503c2db6-448a-4678-a310-f465429e9704'
]

ExecuteIntegrationCommand.args = { 
  'OWNER/API_NAME/VERSION/INTEGRATION_ID': Args.string({
    required: true,
    description: 'Integration to execute for given API on Swaggerhub'
  })
}

ExecuteIntegrationCommand.flags = {
  ...BaseCommand.flags
}

export default ExecuteIntegrationCommand
