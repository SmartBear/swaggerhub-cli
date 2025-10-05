const BaseCommand = require('../../support/command/base-command')
const { Args } = require('@oclif/core')
const { getApiIdentifierArg, getNewApiNameArg } = require("../../support/command/parse-input");

class RenameApiCommand extends BaseCommand {
  async run() {
    const { args } = await this.parse(RenameApiCommand)
    const apiPath = getApiIdentifierArg(args)
    const newName = getNewApiNameArg(args)
    // Your command logic here
    this.log(`Renaming API: ${aapiPath} to ${args.apiNewName}`)

    // TODO: Implement actual rename logic
  }
}

RenameApiCommand.description = "rename an API"

RenameApiCommand.examples = [
  "swaggerhub api:rename organization/apiOldName apiNewName"
]

RenameApiCommand.args = {
    'OWNER/API_OLD_NAME': Args.string({
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