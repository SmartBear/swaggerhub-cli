const { getApi } = require('../../requests/api')
const { getIntegrationIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { getResponseContent } = require('../../support/command/handle-response')
const { prettyPrintJSON } = require('../../utils/general')
const BaseCommand = require('../../support/command/base-command')

class GetIntegrationCommand extends BaseCommand {
  constructor(...props) {
    super(...props)
    this.logIntegration = this.logIntegration.bind(this)
  }

  async run() {
      const { args } = this.parse(GetIntegrationCommand)
      const integrationPath = getIntegrationIdentifierArg(args)
      await this.getIntegration(integrationPath)
  }

  async logIntegration(response) {
    const integration = await getResponseContent(response)
    this.log(prettyPrintJSON(integration))
  }

  async getIntegration(integrationPath) {
    const [owner, api, version, integrationId] = splitPathParams(integrationPath)

    return this.executeHttp({
      execute: () => getApi([owner, api, version, 'integrations', integrationId]), 
      onResolve: this.logIntegration,
      options: {}
    })
  }  
}

GetIntegrationCommand.description = 'retieves an integation for the given API.'

GetIntegrationCommand.examples = [
  'swaggerhub integration:get organization/api/1.0.0/503c2db6-448a-4678-a310-f465429e9704'
]

GetIntegrationCommand.args = [{ 
  name: 'OWNER/API_NAME/VERSION/INTEGRATION_ID',
  required: true,
  description: 'Integration to fetch for given API'
}]

GetIntegrationCommand.flags = {
  ...BaseCommand.flags
}

module.exports = GetIntegrationCommand
