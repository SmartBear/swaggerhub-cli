const { Flags, Args } = require('@oclif/core')
const { putApi } = require('../../requests/api')
const { getIntegrationIdentifierArg, readConfigFile, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class UpdateIntegrationCommand extends BaseCommand {

  async run() {
      const { args, flags } = await this.parse(UpdateIntegrationCommand)
      const integrationPath = getIntegrationIdentifierArg(args)
      const config = readConfigFile(flags.file)
      await this.updateIntegration(integrationPath, config)
  }

  async updateIntegration(integrationPath, config) {
    const [owner, api, version, integrationId] = splitPathParams(integrationPath)
    const updateRequest = {
      pathParams: [owner, api, version, 'integrations', integrationId],
      body: config
    }

    return this.executeHttp({
      execute: () => putApi(updateRequest),
      onResolve: this.logCommandSuccess({ integrationId, apiPath: `${owner}/${api}/${version}` }),
      options: {}
    })
  }  
}

UpdateIntegrationCommand.description = 'update the configuration of an API integration.'

UpdateIntegrationCommand.examples = [
  'swaggerhub integration:update organization/api/1.0.0/503c2db6-448a-4678-abcd-0123456789abc --file config.json'
]

UpdateIntegrationCommand.args = { 
  'OWNER/API_NAME/VERSION/INTEGRATION_ID': Args.string({
    required: true,
    description: 'Integration to update for given API on Swaggerhub'
  })
}

UpdateIntegrationCommand.flags = {
  file: Flags.string({
    char: 'f', 
    description: 'location of integration configuration file',
    required: true
  }),
  ...BaseCommand.flags
}

module.exports = UpdateIntegrationCommand
