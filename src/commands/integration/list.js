const { CliUx } = require('@oclif/core')
const { getApi } = require('../../requests/api')
const { getResponseContent } = require('../../support/command/handle-response')
const { getApiIdentifierArg } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class ListIntegrationCommand extends BaseCommand {
  constructor(...props) {
    super(...props)
    this.logIntegration = this.logIntegration.bind(this)
  }

  async run() {
    const { args } = await this.parse(ListIntegrationCommand)
    const requestedApiPath = getApiIdentifierArg(args)
    const apiPath = await this.ensureVersion(requestedApiPath)
    await this.listIntegrations(apiPath)
  }

  async logIntegration(response) {
    const { integrations } = JSON.parse(await getResponseContent(response))
    CliUx.ux.table(integrations, {
      id: {
        header: 'ID',
        minWidth: 38
      },
      name: {},
      configType: {
        header: 'Type'
      },
      enabled: {}
    }, {
        printLine: this.log.bind(this)
    })
  }

  async listIntegrations(apiPath) {
      return this.executeHttp({
        execute: () => getApi([apiPath, 'integrations']), 
        onResolve: this.logIntegration,
        options: {}
      })
  }  
}

ListIntegrationCommand.description = 'list integrations on an API.'

ListIntegrationCommand.examples = [
  'swaggerhub integration:list organization/api/1.0.0'
]

ListIntegrationCommand.args = [{ 
  name: 'OWNER/API_NAME/[VERSION]',
  required: true,
  description: 'API to list integrations on'
}]

ListIntegrationCommand.flags = {
  ...BaseCommand.flags
}

module.exports = ListIntegrationCommand
