const { flags } = require('@oclif/command')
const { existsSync, readFileSync } = require('fs-extra')
const { hasJsonStructure } = require('../../utils/general')
const { postApi } = require('../../requests/api')
const { getApiIdentifierArg } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')
const { CLIError } = require('@oclif/errors')
const { errorMsg } = require('../../template-strings')

class CreateIntegrationCommand extends BaseCommand {

  async run() {
      const { args, flags } = this.parse(CreateIntegrationCommand)
      const config = this.readConfigFile(flags.file)

      const requestedApiPath = getApiIdentifierArg(args)
      const apiPath = await this.ensureVersion(requestedApiPath)
      await this.createIntegration(apiPath, config)
  }

  readConfigFile(filename) {

    if (!existsSync(filename)) {
      throw new CLIError(errorMsg.fileNotFound({ filename }))
    }

    const config = readFileSync(filename)
    if (config.length === 0) {
      throw new CLIError(errorMsg.fileIsEmpty({ filename }))
    }

    if (!hasJsonStructure(config)) {
      throw new CLIError(errorMsg.invalidConfig())
    }
    return config
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

CreateIntegrationCommand.args = [{ 
  name: 'OWNER/API_NAME/[VERSION]',
  required: true,
  description: 'API where integration will be added'
}]

CreateIntegrationCommand.flags = {
  file: flags.string({
    char: 'f', 
    description: 'location of integration configuration file',
    required: true
  }),
  ...BaseCommand.flags
}

module.exports = CreateIntegrationCommand
