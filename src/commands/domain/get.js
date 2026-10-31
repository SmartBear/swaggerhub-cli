import { Flags, Args } from '@oclif/core'
import { getDomainIdentifierArg, reqType, resolvedParam, splitPathParams } from '../../support/command/parse-input.js'
import { hasJsonStructure, prettyPrintJSON } from '../../utils/general.js'
import { getDomain } from '../../requests/domain.js'
import { getResponseContent } from '../../support/command/handle-response.js'
import BaseCommand from '../../support/command/base-command.js'

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

export default GetDomainCommand
