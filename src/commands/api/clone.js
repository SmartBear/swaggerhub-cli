import BaseCommand from '../../support/command/base-command.js'
import { Args, Flags, Errors } from '@oclif/core'
import { getApiIdentifierArg, apiNameRegex } from '../../support/command/parse-input.js'
import { errorMsg } from '../../template-strings/index.js'
import { postApi } from '../../requests/api.js'

const { CLIError } = Errors

const getNewVersion = args => {
  const newVersion = args['NEW_VERSION']
  if (!apiNameRegex.test(newVersion)) {
    throw new CLIError(errorMsg.argsMustMatchFormat({ format: 'NEW_VERSION' }))
  }
  return newVersion
}

class CloneApiCommand extends BaseCommand {

  async run() {
    const { args, flags } = await this.parse(CloneApiCommand)

    const apiPath = getApiIdentifierArg(args)
    const newVersion = getNewVersion(args)
    const body = { version: newVersion }
    if (flags.visibility) body.private = flags.visibility === 'private'

    this.log(`Cloning API: '${apiPath}' as version '${newVersion}'`)

    await this.executeHttp({
      execute: () => postApi({
        pathParams: [apiPath, 'clone'],
        body: JSON.stringify(body)
      }),
      onResolve: this.logCommandSuccess({ apiPath, newVersion }),
      options: {}
    })
  }
}

CloneApiCommand.description = 'clone an API version as a new version'

CloneApiCommand.examples = [
  'swaggerhub api:clone organization/api/1.0.0 1.0.1',
  'swaggerhub api:clone organization/api/1.0.0 1.0.1 --visibility public'
]

CloneApiCommand.args = {
  'OWNER/API_NAME/VERSION': Args.string({
    required: true,
    description: 'API version to clone'
  }),
  'NEW_VERSION': Args.string({
    required: true,
    description: 'Version identifier of the new API version'
  })
}

CloneApiCommand.flags = {
  visibility: Flags.string({
    description: 'visibility of the new version (defaults to the server setting)',
    options: ['public', 'private']
  }),
  ...BaseCommand.flags
}

export default CloneApiCommand
