const { Flags, Args } = require('@oclif/core')
const { postApi } = require('../../requests/api')
const { getApiIdentifierArg, readConfigFile } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class CreateIntegrationCommand extends BaseCommand {

  async run() {
      const { args, flags } = await this.parse(CreateIntegrationCommand)
      const config = readConfigFile(flags.file)

      const requestedApiPath = getApiIdentifierArg(args)
      const apiPath = await this.ensureVersion(requestedApiPath)
      await this.createIntegration(apiPath, config)
  }

  async createIntegration(apiPath, config) {
    const createRequest = {
      pathParams: [apiPath, 'integrations'],
      body: config
    }

    return this.executeHttp({
      execute: () => postApi(createRequest), 
      onResolve: this.logCommandSuccess({ apiPath }),
      options: {}
    })
  }  
}

CreateIntegrationCommand.description = `creates a new API integration from a JSON configuration file.
See the documentation for configuration files: https://github.com/SmartBear/swaggerhub-cli/tree/master/examples/integrations
When VERSION is not included in the argument, the integration will be added to be default API version.
`

CreateIntegrationCommand.examples = [
  'swaggerhub integration:create organization/api/1.0.0 --file config.json'
]

CreateIntegrationCommand.args = {
  'OWNER/API_NAME/[VERSION]': Args.string({
    required: true,
    description: 'API to add integration to on SwaggerHub'
  })
}

CreateIntegrationCommand.flags = {
  file: Flags.string({
    char: 'f', 
    description: 'location of integration configuration file',
    required: true
  }),
  ...BaseCommand.flags
}

module.exports = CreateIntegrationCommand
