const { flags } = require('@oclif/command')
const { getApiIdentifierArg, reqType, resolvedParam } = require('../../support/command/parse-input')
const { from, hasJsonStructure, prettyPrintJSON } = require('../../utils/general')
const { getApi } = require('../../requests/api')
const { getResponseContent } = require('../../support/command/handle-response')
const BaseCommand = require('../../support/command/base-command')

class GetAPICommand extends BaseCommand {
  constructor(...props) {
    super(...props)
    this.logApiDefinition = this.logApiDefinition.bind(this)
  }

  logApiDefinition(response) {
    const definition = getResponseContent(response)

    this.log(hasJsonStructure(definition)
      ? prettyPrintJSON(definition)
      : definition
    )
  }

  async run() {
    const { args, flags } = this.parse(GetAPICommand)
    const requestedApiPath = getApiIdentifierArg(args)
    const apiPath = await this.ensureVersion(requestedApiPath)
    const [queryParams, requestType] = from(flags)(resolvedParam, reqType)

    await this.executeHttp({
      execute: () => getApi([apiPath], queryParams, requestType),
      onResolve: this.logApiDefinition,
      options: { resolveStatus: [403] }
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
    description: 'gets the resolved API definition (supported in v1.25+). '
  }),
  ...BaseCommand.flags
}

module.exports = GetAPICommand
