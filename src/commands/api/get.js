const { flags } = require('@oclif/command')
const { getApiIdentifierArg, reqType, resolvedParam, splitPathParams } = require('../../support/command/parse-input')
const { pipeAsync, from, hasJsonStructure, prettyPrintJSON } = require('../../utils/general')
const { getApi } = require('../../requests/api')
const { getResponseContent } = require('../../support/command/handle-response')
const BaseCommand = require('../../support/command/base-command')

function versionResponse(content) {
  return JSON.parse(content).version
}

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

  async getDefaultVersion(identifier) {
    return this.executeHttp({
      execute: () => getApi([...identifier, 'settings', 'default']),
      onResolve: pipeAsync(getResponseContent, versionResponse),
      options: { resolveStatus: [403] }
    })
  }

  async ensureVersion([owner, name, version]) {
    const apiVersion = version || await this.getDefaultVersion([owner, name])
    return [owner, name, apiVersion]
  }

  async run() {
    const { args, flags } = this.parse(GetAPICommand)
    const requestedApiPath = getApiIdentifierArg(args)
    const requestedPathParams = splitPathParams(requestedApiPath)
    const pathParams = await this.ensureVersion(requestedPathParams)
    const [queryParams, requestType] = from(flags)(resolvedParam, reqType)

    await this.executeHttp({
      execute: () => getApi(pathParams, queryParams, requestType),
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
