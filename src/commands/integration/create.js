const { flags } = require('@oclif/command')
const { readFileSync } = require('fs-extra')
const { hasJsonStructure } = require('../../utils/general')
const { postApi } = require('../../requests/api')
const { getApiIdentifierArg } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class CreateIntegrationCommand extends BaseCommand {

  async run() {
      const { args, flags } = this.parse(CreateIntegrationCommand)

      const config = readFileSync(flags.file)
      if (!hasJsonStructure(config)) {
        return this.throwCommandError()()
      }

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

CreateIntegrationCommand.description = `creates a new API integation from a JSON configuration file.
See the documentation for example configuration files.
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
    description: 'file location of API to create',
    required: true
  }),
  ...BaseCommand.flags
}

module.exports = CreateIntegrationCommand
