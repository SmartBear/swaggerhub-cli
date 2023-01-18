const { getApiIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')
const UpdateCommand = require('../../support/command/update-command')

class SetDefaultCommand extends UpdateCommand {

  async run() {
    const { args } = await this.parse(SetDefaultCommand)
    const apiPath = getApiIdentifierArg(args)
    const [owner, name, version] = splitPathParams(apiPath)

    await this.updateDefault('apis', owner, name, version)
  }
}

SetDefaultCommand.description = 'set the default version of an API'

SetDefaultCommand.examples = [
  'swaggerhub api:setdefault organization/api/2.0.0'
]

SetDefaultCommand.args = [{ 
  name: 'OWNER/API_NAME/VERSION',
  required: true,
  description: 'API identifier'
}]

SetDefaultCommand.flags = BaseCommand.flags

module.exports = SetDefaultCommand
