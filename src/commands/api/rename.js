const BaseCommand = require('../../support/command/base-command')
const { Args } = require('@oclif/core')
const {
  noVersionRegex,
  apiNameRegex
} = require("../../support/command/parse-input");
const { errorMsg } = require('../../template-strings')
const { CLIError } = require("@oclif/core/lib/errors");

class RenameApiCommand extends BaseCommand {
  async run() {
    const { args } = await this.parse(RenameApiCommand)

    const apiPath = getApiToRename(args)
    const newName = getApiNewName(args)
    // Your command logic here
    this.log(`Renaming API: ${apiPath} to ${newName}`)

    // TODO: Implement actual rename logic
  }
}

const getApiToRename = args => {
  const newName = args['OWNER/API_NAME']
  if (!noVersionRegex.test(newName)) {
    throw new CLIError(errorMsg.argsMustMatchFormat({format: 'OWNER/API_NAME'}))
  }
  return newName
}

const getApiNewName = args => {
  const newName = args['API_NEW_NAME']
  if (!apiNameRegex.test(newName)) {
    throw new CLIError(errorMsg.argsMustMatchFormat({format: 'API_NEW_NAME'}))
  }
  return newName
}

RenameApiCommand.description = "rename an API"

RenameApiCommand.examples = [
  "swaggerhub api:rename organization/apiOldName apiNewName"
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

module.exports = RenameApiCommand