const { Command, flags } = require('@oclif/command')
const { getIdentifierArg, reqType, resolvedParam } = require('../../support/command/parse-input')
const { getApi } = require('../../actions/api')
const { 
  parseResponse, 
  checkForErrors, 
  handleErrors, 
  getResponseContent,
  replaceLink
} = require('../../support/command/response-handler')

const versionResponse = content => JSON.parse(content).version

class GetAPICommand extends Command {

  async getDefaultVersion(identifier) {
    return getApi([...identifier, 'settings', 'default'])
    .then(parseResponse)
    .then(checkForErrors({ resolveStatus: [403] }))
    .then(replaceLink)
    .then(getResponseContent)
    .then(versionResponse)
    .catch(handleErrors)
  }

  async run() {
    const { args, flags } = this.parse(GetAPICommand)
    const identifier = getIdentifierArg(args, false).split('/')
    identifier[2] = identifier[2] || await this.getDefaultVersion(identifier)
    const queryParams = resolvedParam(flags)
    const requestType = reqType(flags)

    await getApi(identifier, queryParams, requestType)
    .then(parseResponse)
    .then(checkForErrors({ resolveStatus: [403] }))
    .then(replaceLink)
    .then(getResponseContent)
    .then(this.log)
    .catch(handleErrors)
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
  })
}

module.exports = GetAPICommand
