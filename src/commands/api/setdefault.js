const { Command, flags } = require('@oclif/command')
const { putApi } = require('../../actions/api')
const { getIdentifierArg } = require('../../support/command/parse-input')
const { parseResponse, checkForErrors, handleErrors } = require('../../support/command/response-handler')

class SetDefaultCommand extends Command {
  async run() {
    const { args } = this.parse(SetDefaultCommand)
    const identifier = getIdentifierArg(args)
    const [owner, name, version] = identifier.split('/')

    const setDefault = {
      pathParams: [owner, name, 'settings', 'default'],
      body: JSON.stringify({ version: version })
    }
    await putApi(setDefault)
    .then(parseResponse)
    .then(checkForErrors)
    .then(() => this.log(`Default version of ${owner}/${name} set to ${version}`))
    .catch(handleErrors)
  }
}

SetDefaultCommand.description = 'set the default version of an API'

SetDefaultCommand.examples = [
  'swaggerhub api:setdefault organization/api/2.0.0'
]

SetDefaultCommand.args = [{ 
  name: 'OWNER/API_NAME/VERSION',
  required: true,
  description: 'API version to set as default'
}]

module.exports = SetDefaultCommand
