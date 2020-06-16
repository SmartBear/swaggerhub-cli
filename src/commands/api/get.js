const { flags } = require('@oclif/command')
const { getIdentifierArg, reqType, resolvedParam } = require('../../support/command/parse-input')
const { pipeAsync } = require('../../utils/general')
const { getApi } = require('../../actions/api')
const { getResponseContent } = require('../../support/command/response-handler')
const BaseCommand = require('../../support/command/base-command')

const versionResponse = content => JSON.parse(content).version

class GetAPICommand extends BaseCommand {

  async getDefaultVersion(identifier) {
    return this.executeHttp({
      execute: () => getApi([...identifier, 'settings', 'default']),
      onSuccess: response => pipeAsync(response)(getResponseContent, versionResponse)
    })
  }

  async run() {
    const { args, flags } = this.parse(GetAPICommand)
    const identifier = getIdentifierArg(args, false).split('/')
    identifier[2] = identifier[2] || await this.getDefaultVersion(identifier)
    const queryParams = resolvedParam(flags)
    const requestType = reqType(flags)

    await this.executeHttp({
      execute: () => getApi(identifier, queryParams, requestType),
      onSuccess: response => pipeAsync(response)(getResponseContent, this.log)
    })
  }
}

GetAPICommand.description = `fetches an API definition
When VERSION is not included in the argument, the default version will be returned.
Returns the API in YAML format by default.
`

GetAPICommand.examples = [
  'swaggerhub api:get organization/api',
  'swaggerhub api:get organization/api/1.0.0 --json'
]

GetAPICommand.args = [{ 
  name: 'OWNER/API_NAME/[VERSION]',
  required: true,
  description: 'SwaggerHub API to fetch'
}]

GetAPICommand.flags = {
  json: flags.boolean({
    char: 'j',
    description: 'returns the API in JSON format.'
  }),
  resolved: flags.boolean({
    char: 'r',
    description: 'gets the resolved API definition.'
  }),
  ...BaseCommand.flags
}

module.exports = GetAPICommand
