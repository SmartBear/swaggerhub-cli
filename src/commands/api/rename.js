import BaseCommand from '../../support/command/base-command.js'
import { Args, Errors } from '@oclif/core'
import { noVersionRegex, apiNameRegex } from '../../support/command/parse-input.js'
import { errorMsg } from '../../template-strings/index.js'
import { postApi } from '../../requests/api.js'

const { CLIError } = Errors

const getApiToRename = args => {
  const newName = args['OWNER/API_NAME']
  if (!noVersionRegex.test(newName)) {
    throw new CLIError(errorMsg.argsMustMatchFormat({ format: 'OWNER/API_NAME' }))
  }
  return newName
}

const getApiNewName = args => {
  const newName = args['API_NEW_NAME']
  if (!apiNameRegex.test(newName)) {
    throw new CLIError(errorMsg.argsMustMatchFormat({ format: 'API_NEW_NAME' }))
  }
  return newName
}

class RenameApiCommand extends BaseCommand {

  async run() {
    const { args } = await this.parse(RenameApiCommand)

    const apiPath = getApiToRename(args)
    const newName = getApiNewName(args)

    this.log(`Renaming API: '${apiPath}' to '${newName}'`)

    await this.executeHttp({
      execute: () => postApi(
          {
            pathParams: [apiPath, 'rename'],
            queryParams: { 'newName': newName },
            body: '{}'
          }),
      onResolve: this.logCommandSuccess({ apiPath, newName }),
      options: {}
    })
  }
}

RenameApiCommand.description = 'rename an API'

RenameApiCommand.examples = [
  'swaggerhub api:rename organization/apiOldName apiNewName'
]

RenameApiCommand.args = {
    'OWNER/API_NAME': Args.string({
      required: true,
      description: 'API to be renamed'
    }),
    'API_NEW_NAME': Args.string({
      required: true,
      description: 'New name for the API'
    })
}

RenameApiCommand.flags = BaseCommand.flags

export default RenameApiCommand