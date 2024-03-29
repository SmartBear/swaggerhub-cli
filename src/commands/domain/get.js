const { Flags, Args } = require('@oclif/core')
const { getDomainIdentifierArg, reqType, resolvedParam, splitPathParams } = require('../../support/command/parse-input')
const { hasJsonStructure, prettyPrintJSON } = require('../../utils/general')
const { getDomain } = require('../../requests/domain')
const { getResponseContent } = require('../../support/command/handle-response')
const BaseCommand = require('../../support/command/base-command')

class GetDomainCommand extends BaseCommand {
  constructor(...props) {
    super(...props)
    this.logDefinition = this.logDefinition.bind(this)
  }

  async logDefinition(response) {
    const definition = await getResponseContent(response)

    this.log(hasJsonStructure(definition)
      ? prettyPrintJSON(definition)
      : definition
    )
  }

  async ensureVersion([owner, name, version]) {
    const domainVersion = version || await this.getDefaultDomainVersion([owner, name])
    return [owner, name, domainVersion]
  }

  async run() {
    const { args, flags } = await this.parse(GetDomainCommand)
    const requestedDomainPath = getDomainIdentifierArg(args)
    const requestedPathParams = splitPathParams(requestedDomainPath)
    const pathParams = await this.ensureVersion(requestedPathParams)
    const queryParams = resolvedParam(flags)
    const requestType = reqType(flags)

    await this.executeHttp({
      execute: () => getDomain(pathParams, queryParams, requestType),
      onResolve: this.logDefinition,
      options: { resolveStatus: [403] }
    })
  }
}

GetDomainCommand.description = `fetches a domain definition
When VERSION is not included in the argument, the default version will be returned.
Returns the domain in YAML format by default.
`

GetDomainCommand.examples = [
  'swaggerhub domain:get organization/domain',
  'swaggerhub domain:get organization/domain/1.0.0 --json'
]

GetDomainCommand.args = {
  'OWNER/DOMAIN_NAME/[VERSION]': Args.string({
    required: true,
    description: 'Domain to fetch from SwaggerHub'
  })
}

GetDomainCommand.flags = {
  json: Flags.boolean({
    char: 'j',
    description: 'returns the domain in JSON format.'
  }),
  ...BaseCommand.flags
}

module.exports = GetDomainCommand
