import { Args } from '@oclif/core'
import { getApiIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import BaseCommand from '../../support/command/base-command.js'
import UpdateCommand from '../../support/command/update-command.js'

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

SetDefaultCommand.args = { 
  'OWNER/API_NAME/VERSION': Args.string({
    required: true,
    description: 'API to set as default on Swaggerhub'
  })
}

SetDefaultCommand.flags = BaseCommand.flags

export default SetDefaultCommand
