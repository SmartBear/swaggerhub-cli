import BaseCommand from '../../support/command/base-command.js'
import { Args, Flags, Errors } from '@oclif/core'
import { getApiIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import { errorMsg } from '../../template-strings/index.js'
import { postApi } from '../../requests/api.js'

const { CLIError } = Errors

const targetRegex = new RegExp(/^[\w\-.]+\/[\w\-.]+\/[\w\-.]+$/)

const getTarget = args => {
  const target = args['NEW_OWNER/NEW_API_NAME/NEW_VERSION']
  if (!targetRegex.test(target)) {
    throw new CLIError(errorMsg.argsMustMatchFormat({ format: 'NEW_OWNER/NEW_API_NAME/NEW_VERSION' }))
  }
  const [owner, name, version] = splitPathParams(target)
  return { owner, name, version }
}

class ForkApiCommand extends BaseCommand {

  async run() {
    const { args, flags } = await this.parse(ForkApiCommand)

    const apiPath = getApiIdentifierArg(args)
    const body = getTarget(args)
    const forkPath = `${body.owner}/${body.name}/${body.version}`
    if (flags.project) body.project = flags.project
    if (flags.visibility) body.private = flags.visibility === 'private'

    this.log(`Forking API: '${apiPath}' as '${forkPath}'`)

    await this.executeHttp({
      execute: () => postApi({
        pathParams: [apiPath, 'fork'],
        body: JSON.stringify(body)
      }),
      onResolve: this.logCommandSuccess({ apiPath, forkPath }),
      options: {}
    })
  }
}

ForkApiCommand.description = `fork an API version
The fork can be created as a new API, or as a new version of another existing API.
`

ForkApiCommand.examples = [
  'swaggerhub api:fork organization/api/1.0.0 myorg/api-fork/1.0.0',
  'swaggerhub api:fork organization/api/1.0.0 myorg/api-fork/1.0.0 --project my-project --visibility private'
]

ForkApiCommand.args = {
  'OWNER/API_NAME/VERSION': Args.string({
    required: true,
    description: 'API version to fork'
  }),
  'NEW_OWNER/NEW_API_NAME/NEW_VERSION': Args.string({
    required: true,
    description: 'Owner, name and version of the fork. An existing API name creates a new version of it.'
  })
}

ForkApiCommand.flags = {
  project: Flags.string({
    description: 'existing project of the target organization to add the fork to'
  }),
  visibility: Flags.string({
    description: 'visibility of the fork (defaults to the visibility of the source version)',
    options: ['public', 'private']
  }),
  ...BaseCommand.flags
}

export default ForkApiCommand
