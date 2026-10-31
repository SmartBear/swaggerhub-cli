import { ux, Args } from '@oclif/core'
import { getApi } from '../../requests/api.js'
import { getResponseContent } from '../../support/command/handle-response.js'
import { getApiIdentifierArg } from '../../support/command/parse-input.js'
import BaseCommand from '../../support/command/base-command.js'

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
    ux.table(integrations, {
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

ListIntegrationCommand.args = { 
  'OWNER/API_NAME/[VERSION]': Args.string({
    required: true,
    description: 'API to list integrations for on Swaggerhub'
  })
}

ListIntegrationCommand.flags = {
  ...BaseCommand.flags
}

export default ListIntegrationCommand
